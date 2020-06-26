const fs = require('fs') // File system node
const data = require('../data.json')
const { date } = require('../utils')

exports.index =  function(req,res) {

  return res.render("members/index", { members: data.members })
}

// create
exports.create = function(req, res) {
  return res.render('members/create')
}

// POST
exports.post = function(req,res) {
  const keys = Object.keys(req.body)

  //req.body
  //{"avatar_url":"http://google.com","name":"Jéssica","birth":"1994-02-12","gender":"F","services":"Ciclismo"}
  
  //req.keys
  //["avatar_url","name","birth","gender","services"]

  for (key of keys) {

    // req.body.key == ""
    if (req.body[key] == "") {
      return res.send('Please, fill all fields')
    }
  }

  birth = Date.parse(req.body.birth)

  let id = 1
  const lastMember = data.members[data.members.length - 1]

  if(lastMember) {
    id = lastMember.id + 1
  }

  data.members.push({
    ...req.body,
    id,
    birth
  })

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) {
      return res.send("Write file error")
    }

    return res.redirect('/members')
  })
}

//show
exports.show = function (req, res) {
  const { id } = req.params
  const foundMember = data.members.find(function(member) {
    return member.id == id
  })

  if (!foundMember) return res.send("Member not found")

  const member = {
    ...foundMember,
    birth: date(foundMember.birth).birthDay
  }

  return res.render("members/show", { member })
}

// edit
exports.edit = function(req, res) {
  const { id } = req.params

  const foundMember = data.members.find(function(member) {
    return member.id == id
  })

  if (!foundMember) return res.send("Member not found")  

  // member.birth = 1278471289724 = standard
  // convert: date(member.birth)
  // return yyyy-mm-dd

  const member = {
    ...foundMember,
    birth: date(foundMember.birth)
  }

  return res.render('members/edit', { member })
}

// update
exports.put = function(req, res) {
  const { id } = req.body
  let index = 0

  const foundMember = data.members.find(function(member, foundIndex) {
    if (id == member.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundMember) return res.send("Member not found")

  const member = {
    ...foundMember,
    ...req.body, // update the new data
    birth: Date.parse(req.body.birth), // timestamp format
    id: Number(req.body.id)
  }

  data.members[index] = member
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return res.send("Write error")

    return res.redirect(`/members/${id}`)
  })
}

// delete
exports.delete = function(req, res) {
  const { id } = req.body

  const filteredMembers = data.members.filter(function(member) {
    return member.id != id 
  })

  data.members = filteredMembers
  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if (err) return res.send("Write file error")

    return res.redirect("/members")
  })
}