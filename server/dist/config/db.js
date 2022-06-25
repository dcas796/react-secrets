"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabase = void 0;
var sqlite3_1 = __importDefault(require("sqlite3"));
var path_1 = __importDefault(require("path"));
var DATABASE_PATH = path_1.default.resolve("secrets.db");
console.log({ DATABASE_PATH: DATABASE_PATH });
var db = new sqlite3_1.default.Database(DATABASE_PATH, sqlite3_1.default.OPEN_READWRITE | sqlite3_1.default.OPEN_CREATE, function (err) {
    if (err == null) {
        createDatabase();
        console.log("Opened " + DATABASE_PATH + " successfully");
    }
    else {
        console.error("Could not open " + DATABASE_PATH + ", reason: " + err.message);
        process.exit(1);
    }
});
var users = [
    { id: 0, name: "admin", password_hash: "", encrypted_secret: "" },
    { id: 1, name: "user1", password_hash: "", encrypted_secret: "" },
    { id: 2, name: "user2", password_hash: "", encrypted_secret: "" }
];
function createDatabase() {
    var db = new sqlite3_1.default.Database(DATABASE_PATH, function (err) {
        if (err != null) {
            console.error("Could not create " + DATABASE_PATH + ", reason: " + err.message);
            process.exit(1);
        }
    });
    // Check if the database is already created
    var isTableCreated = false;
    db.all("\n    select * from information_schema.tables \n    where table_schema = 'dbo'\n    and table_name = 'users'\n    ", function (err, rows) {
        if (err)
            return;
        if (rows.length > 0)
            isTableCreated = true;
    });
    if (isTableCreated)
        return db;
    // Create database
    db.exec("\n    create table users (\n        id int primary key not null,\n        name text not null,\n        password_hash text not null,\n        encrypted_secret text not null\n    );\n    ", function (err) { return console.log(err); });
    // Populate with example users
    var db_values = "";
    users.forEach(function (user, index) {
        db_values += "(" + user.id + ", '" + user.name + "', '" + user.password_hash + "', '" + user.encrypted_secret + "')";
        if (index == users.length - 1)
            db_values += ";";
        else
            db_values += ", ";
    });
    db.exec("\n    insert into users (id, name, password_hash, encrypted_secret)\n        values " + db_values + "\n    ", function (err) { return console.log(err); });
    return db;
}
exports.createDatabase = createDatabase;
exports.default = db;
