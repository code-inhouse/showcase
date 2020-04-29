import React from 'react'

export default class extends React.Component {
  _submit() {
    $.post('/profile/updatecharacter/', {
      'alcohol_attitude': $('#id_alcohol_attitude').val(),
      'smoking_attitude': $('#id_smoking_attitude').val(),
      'build': $('#id_build').val()
    })
    .done(() => {
      console.log('succ')
    })
    .fail(() => {
      console.log('fail')
    })
  }

  render() {
    return (
      <div className="setting">
        <form
          className="form-group"
          method="POST"
          action="/profile/updatecharacter/"
          id="profile-settings-form">
          <div className="form-group">
              <label for="id_alcohol_attitude">{__("Отношение к алкоголю")}: </label>
              <select className="form-control" id="id_alcohol_attitude" name="alcohol_attitude" defaultValue={profile.attitudes.alcohol} required="">
                <option value="no_drink">
                  {__('Не употребляю')}
                </option>
                <option value="company">
                  {__('Только в компании')}
                </option>
                <option value="rarely">
                  {__('Изредка пью')}
                </option>
                <option value="often">
                  {__('Пью часто')}
                </option>
              </select>
          </div>
          <div className="form-group">
              <label for="id_smoking_attitude">{__("Отношение к курению")}</label>
              <select className="form-control" id="id_smoking_attitude" name="smoking_attitude" defaultValue={profile.attitudes.smoking} required="">
                <option
                  value="negative"
                  selected="selected">{__('Негативное')}
                </option>
                <option
                  value="rarely">{__('Курю редко')}
                </option>
                <option
                  value="often">{__('Курю часто')}
                </option>
              </select>
          </div>
          <div className="form-group">
              <label for="id_build">{__("Телосложение")}</label>
              <select className="form-control" id="id_build" name="build" required="" defaultValue={profile.bodyType}>
                <option
                  value="thin"
                  selected="selected">
                    {__('Худощавое')}
                </option>
                <option
                  value="average">
                    {__('Среднее')}
                </option>
                <option
                  value="sport">
                    {__('Спортивное')}
                </option>
                <option
                  value="fat">
                    {__('Полноватое')}
                </option>
              </select>
          </div>
          <a
            className="btn btn-primary"
            onClick={this._submit}
            role="button">
              {__("Сохранить")}
          </a>
        </form>
      </div>
    )
  }
}
