const bcrypt = require('bcrypt');

const password = 'P@ssword1';

bcrypt.hash(password, 10).then(hash => {
    console.log('Generated hash:', hash);
});
