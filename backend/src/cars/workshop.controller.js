const { v4: uuidv4 } = require("uuid");
const Workshop = require("./workshop.model");


const postAWorkshop = async (req, res) => {
    try {
      const { name, description, address, pricing, phone, id } = req.body;
  
      if (!name || !description || !address || !pricing || !phone) {
        return res.status(400).json({
          message: "All fields (name, description, address, pricing, phone) are required.",
        });
      }
  
      const workshopId = id || uuidv4();
  
      const existingWorkshop = await Workshop.findOne({ name, address });
      if (existingWorkshop) {
        return res.status(400).json({ message: "Workshop already exists." });
      }
  
      const newWorkshop = new Workshop({ ...req.body, id: workshopId });
      await newWorkshop.save();
  
      res.status(201).json({
        message: "Workshop created successfully.",
        workshop: newWorkshop,
      });
    } catch (error) {
      console.error("Error creating workshop:", error);
      res.status(500).json({
        message: "Failed to create workshop.",
        error: error.message || error,
      });
    }
  };

const getAllWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find().lean().limit(100);
        res.status(200).json(workshops);
    } catch (error) {
        console.error("Error fetching workshops:", error);
        res.status(500).json({ message: "Failed to fetch workshops" });
    }
};

const getSingleWorkshop = async (req, res) => {
    try {
        const {id} = req.params;
        const workshop =  await Workshop.findById(id);
        if(!workshop){
            res.status(404).send({message: "Workshop not Found!"})
        }
        res.status(200).send(workshop)
        
    } catch (error) {
        console.error("Error fetching workshop", error);
        res.status(500).send({message: "Failed to fetch workshop"})
    }

}

const UpdateWorkshop = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedWorkshop =  await Workshop.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedWorkshop) {
            res.status(404).send({message: "Workshop is not Found!"})
        }
        res.status(200).send({
            message: "Workshop updated successfully",
            workshop: updatedWorkshop
        })
    } catch (error) {
        console.error("Error updating a workshop", error);
        res.status(500).send({message: "Failed to update a workshop"})
    }
}

const deleteAWorkshop = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedWorkshop =  await Workshop.findByIdAndDelete(id);
        if(!deletedWorkshop) {
            res.status(404).send({message: "Workshop is not Found!"})
        }
        res.status(200).send({
            message: "Workshop deleted successfully",
            workshop: deletedWorkshop
        })
    } catch (error) {
        console.error("Error deleting a workshop", error);
        res.status(500).send({message: "Failed to delete a workshop"})
    }
};

module.exports = {
    postAWorkshop,
    getAllWorkshops,
    getSingleWorkshop,
    UpdateWorkshop,
    deleteAWorkshop
}