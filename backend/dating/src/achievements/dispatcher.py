import logging
from datetime import datetime

from .models import (
    AvatarAchievement,
    VisitAchievement,
    LikeAchievement,
    QuestionAchievement,
    PhotoAchievement,
    NewsfeedAchievement,
    NewsPostAchievement,
    MessageAchievement,
    FeedbackAchievement,
    ActivityAchievement,
    SympathiesAchievement,
    AchievementJournal as AJ
)


logger = logging.getLogger(__name__)


def get_next_task(profile, start=None):
    achievements = [
        AvatarAchievement,
        VisitAchievement,
        LikeAchievement,
        QuestionAchievement,
        PhotoAchievement,
        SympathiesAchievement,
        NewsPostAchievement,
        MessageAchievement,
        FeedbackAchievement,
        ActivityAchievement
    ]
    start = start or AvatarAchievement
    starti = achievements.index(start)
    award = 0
    for achievement in achievements[starti:]:
        if not achievement.is_completed(profile):
            return (achievement, award)
        else:
            award += achievement.get_award()


def update_task(profile):
    next_task, award = get_next_task(profile,
                                     start=profile.task.__class__)
    profile.rating += award
    profile.task = next_task.create(profile) if next_task else None


def dispatch(action, profile, **kwargs):
    if not profile.task:
        return
    task = profile.task
    action_to_handler = {
        'ADD_AVATAR': handle_add_avatar,
        'VISIT': handle_visit,
        'LIKE': handle_like,
        'ANSWER_QUESTION': handle_answer_question,
        'ADD_PHOTO': handle_add_photo,
        'VISIT_NEWS': handle_visit_news,
        'VISIT_SYMPATHIES': handle_visit_sympathies,
        'ADD_POST': handle_add_post,
        'ADD_MESSAGE': handle_add_message,
        'WRITE_FEEDBACK': handle_write_feedback,
    }
    if action in action_to_handler:
        did_finish =  action_to_handler[action](profile,
                                                task,
                                                **kwargs)
        if did_finish:
            AJ.objects.create(
                profile=profile,
                task_id=task.pk,
                task_name=task.name,
                started=task.created
            )
        return did_finish
    return False


def handle_add_avatar(profile, task, **kwargs):
    if not isinstance(task, AvatarAchievement):
        return False
    next_task, award = get_next_task(
        profile,
        start=profile.task.__class__)
    profile.rating += award
    profile.task = next_task.create(profile) if next_task else None
    profile.save()
    return True


def handle_visit(profile, task, **kwargs):
    if not isinstance(task, VisitAchievement):
        return False
    update_task(profile)
    profile.save()
    return True


def handle_like(profile, task, **kwargs):
    if not isinstance(task, LikeAchievement):
        return False
    if task.liked + 1 >= task.need_to_like:
        next_task, award = get_next_task(profile,
                                         start=QuestionAchievement)
        profile.rating += award + profile.task.award
        profile.task = (
            next_task.create(profile)
            if next_task
            else None
        )
        profile.save()
        return True
    task.liked += 1
    task.save()
    return False


def handle_answer_question(profile, task, **kwargs):
    if not isinstance(task, QuestionAchievement):
        return False
    question = kwargs.get('question', None)
    if not question:
        msg = 'No `question` param in answer_question dispatcher'
        logger.info(msg)
        return False
    if question.pk in task.questions:
        return False
    task.questions.append(question.pk)
    if len(task.questions) >= task.need_to_answer:
        update_task(profile)
        profile.save()
        return True
    task.save()
    return False


def handle_add_photo(profile, task, **kwargs):
    if not isinstance(task, PhotoAchievement):
        return False
    if task.uploaded + 1 >= task.need_to_upload:
        update_task(profile)
        profile.save()
        return True
    task.uploaded += 1
    task.save()
    return False


def handle_visit_news(profile, task, **kwargs):
    if not isinstance(task, NewsfeedAchievement):
        return False
    next_task, award = get_next_task(profile,
                                     start=NewsPostAchievement)
    profile.rating += profile.task.award + award
    profile.task = next_task.create(profile)
    profile.save()
    return True


def handle_add_post(profile, task, **kwargs):
    if not isinstance(task, NewsPostAchievement):
        return False
    update_task(profile)
    profile.save()
    return True


def handle_add_message(profile, task, **kwargs):
    if not isinstance(task, MessageAchievement):
        return False
    message = kwargs.get('message', None)
    if not message:
        msg = 'No `message` param in message dispatcher'
        logger.info(msg)
        return False
    if message.chat.pk in task.chats:
        return False
    task.chats.append(message.chat.pk)
    if len(task.chats) >= task.need_to_chat:
        update_task(profile)
        profile.save()
        return True
    task.save()
    return False


def handle_write_feedback(profile, task, **kwargs):
    if not isinstance(task, FeedbackAchievement):
        return False
    update_task(profile)
    profile.save()
    return True


def handle_visit_sympathies(profile, task, **kwargs):
    if not isinstance(task, SympathiesAchievement):
        return False
    next_task, award = get_next_task(profile,
                                     start=NewsPostAchievement)
    profile.rating += profile.task.award + award
    profile.task = next_task.create(profile)
    profile.save()
    return True
