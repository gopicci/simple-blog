import jQuery from "jquery";

/**
 * Get cookie entry value
 *
 * @param name Entry to look up
 * @returns Value
 */
export const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

/**
 * Get user login info from API
 *
 * @returns {json} User data
 */
export const getUser = () => {
  return fetch("/api/user")
    .then((res) => res.json().then((data) => ({ ok: res.ok, body: data })))
    .then((res) => {
      if (res.ok) {
        return res.body;
      }
      return null;
    })
    .catch((error) => {
      console.error(error);
    });
};
