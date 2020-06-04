import jQuery from 'jquery';

export const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

export const getUser = () => {
  return fetch('/api/user')
    .then((res) => res.json().then(data => ({ok: res.ok, body: data})))
    .then((res) => {
      if (res.ok) {
       return  res.body;
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
    });
  };
