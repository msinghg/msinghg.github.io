const oauth = require('./oauth');
const passport = require('passport');

const authenticate = (req, res, next) => {
  passport.authenticate('bearer', { session: false })(req, res, async () => {

        try {
          req.access_token = await oauth.fetch(req.headers['cloudhost'], req.headers['account']);
        } catch (e) {
          return res.status(401).send({ message: e.message });
        }
     next()
  });
};

exports.authenticate = authenticate;