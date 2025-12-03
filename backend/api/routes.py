from flask import (Blueprint, jsonify, request)
from backend.auth.auth import authorize
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
@authorize("user")
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
@api_bp.route('property', methods=['POST'])
@authorize("user")
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
@authorize('user')
def get_property(id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM property WHERE id = ?""",(id,))
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
@api_bp.route('/property/<int:id>', methods=['DELETE'])
@authorize('user')
def delete_property(id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM property WHERE id = ?""",(id,))
    row = db_cursor.fetchone()
    if row is None:
        close_db()
        return not_found(f"Property with id: {id}")
    else:
        if get_all_rooms_from_property(id).status_code == 204: #Check that there are no rooms 
            db_cursor.execute("""DELETE FROM property WHERE id = ?""",(id,))
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
    property_id: 1,
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
@api_bp.route('room', methods=['POST'])
@authorize('user')
def create_room():
    data = request.get_json()
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM property WHERE id = ? """,(data["property_id"]))
    property = db_cursor.fetchone()
    if property is None:
        close_db()
        not_found(f"""Property {data["property_id"]}""")
    else:
        db_cursor.execute(""" INSERT INTO room (property_id, name, descr)
                        VALUES (?, ?, ?)""",(
                        (data["property_id"]),
                        (data["name"]),
                        (data["descr"])
                        ))
        db_con.commit()
        new_id = db_cursor.lastrowid
        close_db()
        return jsonify({"id": new_id, **data}), 201

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
def get_all_rooms_from_property(property_id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM property WHERE id =?""",(property_id,))
    property = db_cursor.fetchone()
    if property is None:
        close_db()
        return not_found(f"""Property {property_id}""")
    else:
        db_cursor.execute("""SELECT * FROM room WHERE property_id =?""",(property_id,))
        rows = db_cursor.fetchall()
        rooms = rows_to_dict(rows)
        if rooms:
            close_db()
            resp =jsonify(rooms)
            resp.status_code = 200
            return resp
        else:
            close_db
            resp = jsonify({"message": "No Rooms in this property"})
            resp.status_code = 204
            return resp

"""
Definition for route to delete a room, the fetch could be like:
fetch(`http://127.0.0.1:5000/api/property/2/room/3`, {
  method: "DELETE"
})
.then(async response => {AND room_id={room_id}
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
@api_bp.route('room/<int:room_id>', methods=['DELETE'])
@authorize('user')
def delete_room(room_id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM room WHERE id = ?""", (room_id,))
    room = db_cursor.fetchone()
    # Does the room exist?
    if room is not None:
      room = dict(room)
      db_cursor.execute("SELECT count(*) as n FROM item where room_id = ?",(room_id,))
      n_items = db_cursor.fetchone()
      n_items = dict(n_items)["n"]
      # Does the room have items?
      if n_items != 0:
          return jsonify({"message": "Room contains items"}), 405
      else:
          db_cursor.execute("SELECT * FROM property where id = ?",(room["property_id"],))
          property =  db_cursor.fetchone()
          # Does the room belong inside a property? ¬¬ this check is probably unnecesary
          if property is not None:
              db_cursor.execute("DELETE FROM room where id = ?",(room_id,))
              db_con.commit()
              close_db()
              return jsonify({"message": f"room {room_id} deleted succesfully"}), 204
          else:
              return jsonify({"message": "The room does not belong to a property"}), 409
    else:
        return not_found("room")
# /////////////////--ITEMS--\\\\\\\\\\\\\\\\\
"""
Definition for route to create an item in a room, the fetch could be like:
fetch("http://127.0.0.1:5000/api/room/2/item", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
    room_id: 2,
    name: "Television",
    description: "a 55\" television",
    image_url: null
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
@api_bp.route('item', methods=['POST'])
@authorize('user')
def create_item():
    data = request.get_json()
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM room WHERE id = ?""",(data["room_id"],))
    room = db_cursor.fetchone()
    if room is None:
        close_db()
        return jsonify({"message":"Room not found"}), 404
    else:
        db_cursor.execute(""" INSERT INTO item (room_id, name, description, image_url)
                VALUES (?, ?, ?, ?)""",(
                (data["room_id"]),
                (data["name"]),
                (data["description"]),
                (data["image_url"])
                ))
        db_con.commit()
        new_id = db_cursor.lastrowid
        close_db()
        return jsonify({"id": new_id, **data}), 201


"""
Definition for route to get all items IN A room, the fetch could be like:
fetch("http://127.0.0.1:5000/api/room/2/item")
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
@api_bp.route('room/<int:room_id>/item', methods=['GET'])
def get_all_items_from_room(room_id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    #Check the room exists
    db_cursor.execute("""SELECT count(*) FROM room WHERE id = ?""",(room_id,))
    room_exists = bool(dict(db_cursor.fetchone()).get('count(*)')) #if count is 1 or more it will be true
    if room_exists:
        db_cursor.execute("""SELECT * FROM item WHERE room_id =?""",(room_id,))
        items = rows_to_dict(db_cursor.fetchall())
        close_db()
        if items:
            return jsonify(items), 200
        else:
            return jsonify({"message": "No items found"}), 204
    else:
        close_db()
        return jsonify({"message": f"Room {room_id} does not exist"}), 404
    
"""
Definition for route to delete an item in a room, the fetch could be like:
fetch("http://127.0.0.1:5000/api/room/2/item/2", {
    method: "DELETE"
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
@api_bp.route('item/<int:item_id>', methods=['DELETE'])
@authorize('user')
def delete_item(item_id):
    db_con = get_db()
    db_cursor = db_con.cursor()
    db_cursor.execute("""SELECT * FROM item WHERE id = ?""",(item_id,))
    item = db_cursor.fetchone()
    if item is None:
        close_db()
        return jsonify({"message":"item not found"}), 404
    else:
        db_cursor.execute("""DELETE FROM item WHERE id=?""",(item_id,))
        db_con.commit()
        close_db()
        return jsonify({"message":f"Item {item_id} Deleted Successfully"}), 204

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