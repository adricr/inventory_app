from flask import (Blueprint, jsonify, request)
from ..db.db import (get_db, close_db)

api_bp = Blueprint('api',__name__)

"""
Definition for route to get all properties, the fetch could be like:
fetch("http://127.0.0.1:5000//api/property")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log("All properties:", data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

"""
@api_bp.route('/property', methods=['GET'])
def property():
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM property""")
    rows = db_cursor.fetchall()
    properties = rows_to_dict(rows)
    close_db()
    return jsonify(properties), 200

"""
Definition for route to insert a new property, the fetch could be like:
fetch("http://127.0.0.1:5000/api/property/new_property", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    number: 12,
    street: "Baker Street",
    city: "London",
    postcode: "NW1 6XE",
    image_url: "https://example.com/house.jpg",
    tenant_name: "John Doe",
    landlord_name: "Mrs. Smith"
  })
})
.then(res => res.json())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));


"""
@api_bp.route('/property/new_property', methods=['POST'])
def new_property():
    data = request.get_json()
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute(""" INSERT INTO property (number, street, city, postcode, image_url, tenant_name, landlord_name)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",(
                       (data["number"]),
                       (data["street"]),
                       (data["city"]),
                       (data["postcode"]),
                       (data["image_url"]),
                       (data["tenant_name"]),
                       (data["landlord_name"])
                       ))
    db_con.commit()
    new_id = db_cursor.lastrowid
    close_db()
    return jsonify({"id": new_id, **data}), 201

# helper method to create dictionaries from rows
def rows_to_dict(rows):
    dictionary = []
    for row in rows:
        dictionary.append(dict(row))
    return dictionary
    