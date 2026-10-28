var bodyParser    = require("body-parser"),
methodOverride    = require("method-override"),
expressSanitizer  = require("express-sanitizer"),
passport          = require("passport"),
flash             = require("connect-flash"),
User              = require("./models/user"),
Product           = require("./models/product"),
mongoose          = require("mongoose"),
express           = require("express"),
LocalStrategy     = require("passport-local"),
app               = express();


//requiring routes
var productRoutes    = require("./routes/products"),
    indexRoutes      = require("./routes/index");

// APP CONFIG
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/salesapp");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: process.env.SESSION_SECRET || "change-me-in-production",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


app.use("/", indexRoutes);
app.use("/products", productRoutes);

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

