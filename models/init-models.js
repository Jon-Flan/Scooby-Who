var DataTypes = require("sequelize").DataTypes;
var _advert_offers = require("./advert_offers");
var _advert_pictures = require("./advert_pictures");
var _adverts = require("./adverts");
var _breeders = require("./breeders");
var _customers = require("./customers");
var _invoice_items = require("./invoice_items");
var _invoices = require("./invoices");
var _messages = require("./messages");
var _reviews = require("./reviews");
var _users = require("./users");

function initModels(sequelize) {
  var advert_offers = _advert_offers(sequelize, DataTypes);
  var advert_pictures = _advert_pictures(sequelize, DataTypes);
  var adverts = _adverts(sequelize, DataTypes);
  var breeders = _breeders(sequelize, DataTypes);
  var customers = _customers(sequelize, DataTypes);
  var invoice_items = _invoice_items(sequelize, DataTypes);
  var invoices = _invoices(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  advert_offers.belongsTo(adverts, { foreignKey: "advert_id"});
  adverts.hasMany(advert_offers, { foreignKey: "advert_id"});
  advert_offers.belongsTo(customers, { foreignKey: "customer_id"});
  customers.hasMany(advert_offers, { foreignKey: "customer_id"});
  advert_pictures.belongsTo(adverts, { foreignKey: "advert_id"});
  adverts.hasMany(advert_pictures, { foreignKey: "advert_id"});
  adverts.belongsTo(users, { foreignKey: "user_id"});
  users.hasMany(adverts, { foreignKey: "user_id"});
  breeders.belongsTo(users, { foreignKey: "user_id"});
  users.hasMany(breeders, { foreignKey: "user_id"});
  customers.belongsTo(users, { foreignKey: "user_id"});
  users.hasMany(customers, { foreignKey: "user_id"});
  invoice_items.belongsTo(invoices, { foreignKey: "invoice_id"});
  invoices.hasMany(invoice_items, { foreignKey: "invoice_id"});
  invoices.belongsTo(breeders, { foreignKey: "breeder_id"});
  breeders.hasMany(invoices, { foreignKey: "breeder_id"});
  invoices.belongsTo(customers, { foreignKey: "customer_id"});
  customers.hasMany(invoices, { foreignKey: "customer_id"});
  messages.belongsTo(users, { foreignKey: "user_from_id"});
  users.hasMany(messages, { foreignKey: "user_from_id"});
  messages.belongsTo(users, { foreignKey: "user_to_id"});
  users.hasMany(messages, { foreignKey: "user_to_id"});
  reviews.belongsTo(breeders, { foreignKey: "breeder_id"});
  breeders.hasMany(reviews, { foreignKey: "breeder_id"});
  reviews.belongsTo(customers, { foreignKey: "customer_id"});
  customers.hasMany(reviews, { foreignKey: "customer_id"});

  return {
    advert_offers,
    advert_pictures,
    adverts,
    breeders,
    customers,
    invoice_items,
    invoices,
    messages,
    reviews,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
