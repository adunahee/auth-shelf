const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * Get all of the items on the shelf
 */

router.get('/', (req, res) => {
    pool.query('SELECT * FROM "item";')
        .then(results => res.send(results.rows))
        .catch(error => {
            console.log('Error making SELECT for secrets:', error);
            res.sendStatus(500);
        });
});


/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', (req, res) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
        console.log(req.user);
        let queryText = `INSERT INTO "item" ("description", "image_url", "person_id")
                        VALUES ($1, $2, $3);`;
        pool.query(queryText, [req.body.description, req.body.image_url, req.user.id])
        .then(response => {
            res.send(response.rows);
        }).catch(error => {
            console.log('error posting item', error);
            res.sendsStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
});


/**
 * Delete an item if it's something the logged in user added
 */
router.delete('/:id', (req, res) => {
    let item = req.params;
    console.log(item);
    sqlText = `DELETE FROM "item" WHERE "id" = '${item.id}'`;
    pool.query(sqlText);
    res.sendStatus(200);
});
// router.delete('/:id', (req, res) => {
//     console.log(req.params);
//     let animal = req.params;
//     console.log(animal.id);

//     sqlText = `DELETE FROM "species" WHERE "species_name" = '${animal.id}'`;
//     res.sendStatus(200);
//     pool.query(sqlText);
// });

/**
 * Update an item if it's something the logged in user added
 */
router.put('/:id', (req, res) => {

});


/**
 * Return all users along with the total number of items 
 * they have added to the shelf
 */
router.get('/count', (req, res) => {

    if (req.isAuthenticated()) {
        console.log('req.user: ', req.user);
        const queryText = `SELECT "username", COUNT("description")as "description"
                           FROM "person"
                           JOIN "item" ON "person"."id" = "item"."person_id"
                           GROUP BY "username";`;
        pool.query(queryText)
        .then((results) => {
            res.send(results.rows);
        }).catch((error) => {
            console.log('Error in GET /count: ', error);
            res.sendStatus(500);
        })
    } else {
        res.sendStatus(403);
    }
});


/**
 * Return a specific item by id
 */
router.get('/:id', (req, res) => {

});

module.exports = router;