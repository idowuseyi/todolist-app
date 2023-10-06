
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const URI = process.env.connectionString;

mongoose.connect(URI);

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

item1 = new Item({
  name: "Welcome to your todo list!."
});

item2 = new Item({
  name: "Hit the + button to add a new item."
});

item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

  main().catch(err => console.log(err));

  async function main() {
  let foundItems = await Item.find({});

  if (foundItems.length === 0) {
    Item.insertMany(defaultItems);
    console.log("Successfully saved default items to DB.");
    res.redirect("/");
  } else {
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  }

});

app.get("/:customListName", function(req, res){
  main().catch(err => console.log(err));

  async function main() {
  const customListName = _.capitalize(req.params.customListName);

  const foundList = await List.findOne({ name: customListName});

  if (foundList){

    res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
  } else {
    console.log("This list doesn't exist but is now created! :) ...");
    // create a new list
    const list = new List({
      name: customListName,
      items: defaultItems
    });

    list.save();
    res.redirect("/" + customListName);
  }

}});


app.post("/", function(req, res){

  main().catch(err => console.log(err));

  async function main() {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item ({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
  res.redirect("/");
  } else {
    foundList = addItem = await List.findOne({name: listName});
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  }
}
});

app.post("/delete", function(req, res){
  main().catch(err => console.log(err));

  async function main() {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    checkedRoute = await Item.findByIdAndRemove(checkedItemId);
    if (checkedRoute) {
    console.log("Successfully delete checked item.");
    res.redirect("/");
    }
  } else {

    const delList = await List.find({ name: listName })

    if (delList) {
    let  pracList = delList[0].items
      pracList.forEach(element => {
        if (element._id == checkedItemId){
        const index = pracList.indexOf(element);
        if (index > -1) {
          pracList.splice(index, 1);
        }
        
        }
  });
  const update_id = (delList[0]._id);
  await List.findOneAndUpdate({ _id: update_id }, { items: pracList } );

      console.log("Successfully delete checked item.");
      res.redirect("/" + listName);
    }
  }
  }
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
