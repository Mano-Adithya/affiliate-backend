async function dateFormat() {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const [month, day, year] = formatter.format(new Date()).split("/");
  const currentDate = `${year}-${month}-${day} 23:59:59`;
  const firstDate = `${year}-${month}-01 00:00:00`;

  const firstDateObj = new Date();
  firstDateObj.setDate(firstDateObj.getDate() - 30);
  const [firstMonth, firstDay, firstYear] = formatter
    .format(firstDateObj)
    .split("/");
  const First_Date = `${firstYear}-${firstMonth}-${firstDay} 00:00:00`;

  return { firstDate, currentDate, First_Date };
}

export default dateFormat;
