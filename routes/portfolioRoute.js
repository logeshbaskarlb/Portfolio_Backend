const router = require("express").Router();
const {
  Intro,
  About,
  Project,
  Contact,
  Experience,
  SocialMedia
} = require("../models/portfolioModel");
const bcrypt = require("bcryptjs");
const URL = process.env.MONGO_URL;
const { MongoClient } = require("mongodb");
const jsonwebtoken = require("jsonwebtoken");

//get all portfolio data
router.get("/get-portfolio-data", async (req, res) => {
  try {
    const intros = await Intro.find();
    const abouts = await About.find();
    const projects = await Project.find();
    const contacts = await Contact.find();
    const experiences = await Experience.find();

    res.status(200).send({
      intro: intros[0],
      about: abouts[0],
      projects: projects,
      contact: contacts[0],
      experiences: experiences,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// update intro
router.post("/update-intro", async (req, res) => {
  try {
    const intro = await Intro.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).send({
      data: intro,
      success: true,
      message: "Intro updated successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//update about
router.post("/update-about", async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    ); //return the new value not the old one
    res.status(200).send({
      data: about,
      success: true,
      message: "Intro updated successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//add experience
router.post("/add-experience", async (req, res) => {
  try {
    let exp = new Experience(req.body);
    const experience = await exp.save();
    res
      .status(201)
      .send({
        data: experience,
        success: true,
        message: "Experience added Successfully!",
      });
  } catch (err) {
    res.status(400).send(err);
  }
});

//update experience
router.post("/update-experience",async(req,res)=>{
    try {
        const experience = await Experience.findOneAndUpdate(
            {_id : req.body._id},
            req.body,
            {new : true }
        );
        res.status(200).send({
            data: experience,
            success:true,
            message:"Experience has been updated"
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

//delete experience
router.post("/delete-experience",async (req,res)=>{
    try {
        const experience = await Experience.findOneAndDelete({
            _id : req.body._id
        });
        res.status(200).send({
            data:experience,
            success:true,
            message:"Experience has been deleted!"
        })
    } catch (error) {
        res.status(500).send(error);
    }
})

//add Project
router.post("/add-project",async(req,res)=>{
    try {
        const project = new Project(req.body);
       await project.save();
        res.status(200).send({
            data: project,
            success:true,
            message:"Project added successfully"
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

//update project
router.post("/update-project",async(req,res)=>{
    try {
        const project = await Project.findOneAndUpdate(
            {_id : req.body._id},
            req.body,
            {new : true }
        );
        res.status(200).send({
            data: project,
            success:true,
            message:"Project has been updated"
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

//delete Project
router.post("/delete-project",async (req,res)=>{
    try {
        const project = await Project.findOneAndDelete({
            _id : req.body._id
        });
        res.status(200).send({
            data:project,
            success:true,
            message:"Project has been deleted!"
        })
    } catch (error) {
        res.status(500).send(error);
    }
});

//update contact
router.post("/update-contact",async (req,res)=>{
    try {
        const contact = await Contact.findOneAndUpdate(
            {_id : req.body._id},
            req.body,
            {new : true}
        );
        res.status(200).send({
            data : contact,
            success:true,
            message : "Contact updated successfully"
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

// update socialMedia

// router.post("/update-socialMedia", async (req,res) =>{
//   try {
//     const socialMedia = await SocialMedia.findOneAndUpdate({
//       _id : req.body._id
//     },
//     req.body,
//     {new : true});
//     res.status(200).send({
//       data : socialMedia,
//       success : true,
//       message : "Updated successsfully"
//     })
//   } catch (error) {
//     res.status(500).send(error);
//   }
// })







module.exports = router;
