/**
 * Builds a string with post author and date details
 *
 * @param author Author name
 * @param created Post creation DateField
 * @param updated Latest post update DateField
 * @returns {string} Formatted post details
 */
export const dateBuilder = (author, created, updated) => {
  const dateFormat = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const createdOn = new Date(created);
  const updatedOn = new Date(updated);

  if (created.substring(0, 20) === updated.substring(0, 20))
    return (
      "Posted by " +
      author +
      " on " +
      createdOn.toLocaleDateString(undefined, dateFormat)
    );
  return (
    "Last updated by " +
    author +
    " on " +
    updatedOn.toLocaleDateString(undefined, dateFormat)
  );
};
