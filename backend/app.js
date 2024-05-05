var express = require("express"),
    path = require("path"),
    bodyParser = require('body-parser'),
    pg = require('pg');
const cors = require('cors');

const jsonParser = bodyParser.json();
var app = express();

const config = {
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT              
};
var pool = new pg.Pool(config);

app.use(express.static(path.join(__dirname, 'public')));
app.use(jsonParser);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}

function handleFetchClientError(res, err) {
    console.error("Error fetching the client", err);
    res.status(400);
    return;
}

function handleRunningQueryError(res, err) {
    console.error("Error running the query", err);
    res.status(404);
    return;
}

app.get('/', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return handleFetchClientError(res, err);
        }
        client.query('SELECT * FROM "Houses"', function (err, result) {
            if (err) {
                return handleRunningQueryError(res, err);
            }
            res.json({ data: result.rows });
            done();
        });
    });
});

app.get('/gas/:id', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return handleFetchClientError(res, err);
        }
        client.query('SELECT * FROM "Utilities" WHERE house_id = $1 AND type=\'gas\'', [sanitize(req.params.id)], function (err, result) {
            if (err) {
                return handleRunningQueryError(res, err);
            }
            res.json({ data: result.rows });
            done();
        });
    });
});

app.get('/electricity/:id', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return handleFetchClientError(res, err);
        }
        client.query('SELECT * FROM "Utilities" WHERE house_id = $1 AND type=\'electricity\'', [sanitize(req.params.id)], function (err, result) {
            if (err) {
                return handleRunningQueryError(res, err);
            }
            res.json({ data: result.rows });
            done();
        });
    });
});

app.post('/add-utility-record/', jsonParser, function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return handleFetchClientError(res, err);
        }
        const date = (req.body.date).toString();
        client.query(`INSERT INTO "Utilities"("readingValue", date, house_id, type) VALUES(
            ${sanitize(req.body.value)}, '${sanitize(date)}', ${sanitize(req.body.id)}, '${sanitize(req.body.type.toLowerCase())}')`,
            function (err, result) {
                if (err) {
                    return handleRunningQueryError(res, err);
                }
                res.status(201).send('success');
                done();
        });
    });
});

app.post('/add-house/', jsonParser, function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return handleFetchClientError(res, err);
        }
        client.query(`INSERT INTO "Houses"(city, street) VALUES('${sanitize(req.body.city)}', '${sanitize(req.body.street)}')`,
            function (err, result) {
                if (err) {
                    return handleRunningQueryError(res, err);
                }
                else {
                    res.status(201).send('success');
                }                
                done();
            });
    });
});

app.get('/search/:city/:street', jsonParser, function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            return handleFetchClientError(res, err);
        }
        const city = (req.params.city && req.params.city !== '-') ? ` city ILIKE '${sanitize(req.params.city)+'%'}' ` : '';
        const street = (req.params.street && req.params.street !== '-') ? ` street ILIKE '${sanitize(req.params.street) + '%'}' ` : '';
        const join = (city !== '' && street !== '') ? 'AND' : '';
        const where = (city !== '' || street !== '') ? 'WHERE' : '';
        client.query(`SELECT * FROM "Houses" ${where} ${city} ${join} ${street};`, function (err, result) {
            if (err) {
                return handleRunningQueryError(res, err);
            }
            else {
                res.json({ data: result.rows });
            }            
            done();
        });
    });
});

app.listen(4000, function (){
    console.log('Server started on port 4000');
})