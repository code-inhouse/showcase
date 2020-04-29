import React from 'react'


export default class extends React.Component {
  componentDidMount() {
    let slider = document.getElementById('age-search-slider')
    window.noUiSlider.create(slider, {
        start: [profile.lookingFor.age.from, profile.lookingFor.age.to],
        step: 1,
        connect: true,
        tooltips: true,
        format: wNumb({
            decimals: 0
        }),
        range: {
            'min': [18],
            '80%': [60],
            'max': [100]
        }
    })
    slider.noUiSlider.on('slide', () => {
        let [lower, upper] = slider.noUiSlider.get()
        document.getElementById('lower-age-bound').value = lower
        document.getElementById('upper-age-bound').value = upper
    })
  }

  _submit = () => {
    $.post('/profile/updatesearch/', {
      'lower_age_bound': $('#lower-age-bound').val(),
      'upper_age_bound': $('#upper-age-bound').val(),
      'looking_for': $('input[name=looking_for]:checked')[0].value,
      'purpose': $('#purpose').val()
    })
    .done(() => {
      console.log('succ')
    })
    .fail(() => {
      console.log('fail')
    })
  }

  render() {
    console.log('render')
    return (
      <div className="setting">
        <form
          className="form-group"
          method="POST"
          action="/profile/updatesearch/"
          id="update-search-options">
          <input
            type="text"
            id="lower-age-bound"
            name="lower_age_bound"
            hidden="true"
            defaultValue={profile.lookingFor.age.from}/>
          <input
            type="text"
            id="upper-age-bound"
            name="upper_age_bound"
            hidden="true"
            defaultValue={profile.lookingFor.age.to}/>
          <div className="form-group">
              <p>{__('Ищу')}</p>
              <input type="radio" id="looking-for-male" name="looking_for" value="male" defaultChecked={profile.lookingFor.sex == 'male'}/>
              <label>{__('Мужчину')}</label>
              <br/>
              <input type="radio" id="looking-for-female" name="looking_for" value="female" defaultChecked={profile.lookingFor.sex == 'female'}/>
              <label>{__('Женщину')}</label>

          </div>
          <div className="form-group">
              <label for="purpose">{__('Цель знакомства')}</label>
              <select name="purpose" id="purpose" className="form-control" defaultValue={profile.purpose}>
                  <option value="long_term">{__('Серьёзные отношения')}</option>
                  <option value="short_term">{__('Быстрые отношения')}</option>
                  <option value="new_friends">{__('Новые знакомства')}</option>
              </select>
          </div>
          <p>{__('Возрастом: ')}</p>
          <div id="age-search-slider" style={{
           marginLeft: 13,
           marginTop: 50,
           marginBottom: 20
          }}/>
          <a className="btn btn-primary" role="button" id="update-looking-for-button" onClick={this._submit}>{__('Сохранить')}</a>
      </form>
      </div>
    )
  }
}
