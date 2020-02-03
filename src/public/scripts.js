$(function() {
  getQuotes();
});

const getQuotes = async () => {
  try {
    let res = await fetch("/quotes");
    let quotes = await res.json();
    generateView(quotes.data);
  } catch (e) {
    console.error(e);
  }
};

const generateView = quotes => {
  console.log(quotes);
};
