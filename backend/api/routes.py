from flask import (Blueprint, jsonify, request)
from ..db.db import (get_db, close_db)

api_bp = Blueprint('api',__name__)
# /////////////////--PROPERTIES--\\\\\\\\\\\\\\\\\
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

"""
Definition for route to get all properties, the fetch could be like:
fetch("http://127.0.0.1:5000/api/property/1")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log("Property:", data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

"""
@api_bp.route('/property/<int:id>', methods=['GET'])
def get_property(id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute(f"""SELECT * FROM property WHERE id = {id}""")
    row = db_cursor.fetchone()
    close_db()
    if row is not None:
        property = dict(row)
        return jsonify(property), 200
    else:
        return not_found(f"Property with id: {id}")

"""
Definition for route to delete a property, the fetch could be like:
fetch("http://127.0.0.1:5000/api/property/2", {
  method: "DELETE"})
.then(res => res.json())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
"""
@api_bp.route('/property/<id>', methods=['DELETE'])
def delete_property(id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute(f"""SELECT * FROM property WHERE id = {id}""")
    row = db_cursor.fetchone()
    if row is None:
        close_db()
        return not_found(f"Property with id: {id}")
    else:
        if get_all_rooms(id)[1] == 204: #Check that there are no rooms 
            db_cursor.execute(f"""DELETE FROM property WHERE id = {id}""")
            db_con.commit()
            close_db()
            return jsonify({"message": f"""Property with id: {id} deleted successfully"""}),204
        else:
            close_db()
            return jsonify({"message": "The property has room(s)"}), 405
# /////////////////--ROOMS--\\\\\\\\\\\\\\\\\

"""
Definition for route to create a room in a property, the fetch could be like:
fetch("http://127.0.0.1:5000/api/property/2/room", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
    name: "Kitchen",
    descr: "A pretty well kept kitchen"
    })
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

"""
@api_bp.route('property/<int:property_id>/room', methods=['POST'])
def create_room(property_id):
    data = request.get_json()
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute(f"""SELECT * FROM property WHERE id ={property_id}""")
    property = db_cursor.fetchone()
    if property is None:
        close_db()
        not_found(f"""Property {property_id}""")
    else:
        db_cursor.execute(""" INSERT INTO room (property_id, name, descr)
                        VALUES (?, ?, ?)""",(
                        (property_id),
                        (data["name"]),
                        (data["descr"])
                        ))
        db_con.commit()
        new_id = db_cursor.lastrowid
        close_db()
        return jsonify({"id": new_id, "property_id": property_id, **data}), 201

"""
Definition for route to get all ROOMS IN A PROPERTY, the fetch could be like:
fetch("http://127.0.0.1:5000/api/property/2/room")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

"""
@api_bp.route('property/<int:property_id>/room', methods=['GET'])
def get_all_rooms(property_id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute(f"""SELECT * FROM property WHERE id ={property_id}""")
    property = db_cursor.fetchone()
    if property is None:
        close_db()
        return not_found(f"""Property {property_id}""")
    else:
        db_cursor.execute(f"""SELECT * FROM room WHERE property_id ={property_id}""")
        rows = db_cursor.fetchall()
        rooms = rows_to_dict(rows)
        if rooms:
            close_db()
            return jsonify(rooms), 200
        else:
            close_db
            return jsonify({"message": "No Rooms in this property"}), 204

"""
Definition for route to delete a room, the fetch could be like:
fetch(`http://127.0.0.1:5000/api/property/2/room/3`, {
  method: "DELETE"
})
.then(async response => {
  // If DELETE returns 204 (No Content), there's nothing to parse
  if (response.status === 204) {
    console.log("Room deleted successfully (204 No Content)");
    return;
  }

  // Otherwise, try to parse JSON
  const data = await response.json();
  console.log("Response:", data);
})
.catch(err => console.error("Fetch error:", err));
 
 @returns 404 if the property does not exist, 405 if the room has still items, 204 if room deleted succesfully 
"""
@api_bp.route('property/<int:property_id>/room/<int:room_id>', methods=['DELETE'])
def delete_room(property_id, room_id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute(f"""SELECT * FROM property WHERE id ={property_id}""")
    property = db_cursor.fetchone()
    # Does the property exist?
    if property is None:
        close_db()
        return not_found(f"""Property {property_id}""")
    else:
        # Does the room exist??
        db_cursor.execute(f"""SELECT * FROM room WHERE id ={room_id}""")
        room = db_cursor.fetchone()
        if room is None:
            close_db()
            return not_found(f"""Room {room_id}""")
        else:
            # Is there Items in the room?????
            db_cursor.execute(f"""SELECT * FROM item WHERE room_id = {room_id}""")
            rows = db_cursor.fetchall()
            rows_count = len(rows)
            print(rows_count)
            if rows_count != 0:
                close_db()
                return jsonify({"message": f"The room still has {rows_count} item(s)"}), 405
            else:
                db_cursor.execute(f"""DELETE FROM room WHERE id={room_id}""")
                db_con.commit()
                close_db()
                return jsonify({"message": f"""Room with id: {room_id} deleted successfully"""}),204
            # Could this have been made easier with a join??? ABSOLUTELY BUT I LOVE TECHNICAL DEBT

# /////////////////--ITEMS--\\\\\\\\\\\\\\\\\
# /////////////////--HELPER METHODS--\\\\\\\\\\\\\\\\\ 
# Helper method to create dictionaries from rows
def rows_to_dict(rows):
    dictionary = []
    for row in rows:
        dictionary.append(dict(row))
    return dictionary

# Helper method for not found resources
def not_found(resource):
    return jsonify({"error":f"""{resource} not found"""}), 404