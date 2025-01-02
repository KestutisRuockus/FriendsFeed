export const formatDate = (isNewCommentDate = false, postDate = 0) => {
  const date = isNewCommentDate ? new Date() : new Date(postDate * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const amOrPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes} ${amOrPm}`;
  console.log(formattedDateTime);

  return formattedDateTime;
};
