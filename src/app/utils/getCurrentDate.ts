//現在の日付を取得
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);

  return year + "-" + month + "-" + day + " ";
};
//返り値 : 2023-01-02 (String型)
