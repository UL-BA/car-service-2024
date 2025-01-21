const Service = require("../cars/workshop.model");
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services", error });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedService)
      return res.status(404).json({ message: "Service not found" });
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: "Failed to update service", error });
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, address, pricing } = req.body;

    if (!name || !description || !address || !pricing) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingService = await Service.findOne({ name, address });
    if (existingService) {
      return res
        .status(400)
        .json({ message: "A service with the same name and address already exists." });
    }

    const newService = new Service({
      name,
      description,
      address,
      pricing,
    });

    await newService.save();

    res.status(201).json({
      message: "Service added successfully.",
      service: newService,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ message: "Failed to add service.", error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService)
      return res.status(404).json({ message: "Service not found" });
    res
      .status(200)
      .json({
        message: "Service deleted successfully",
        service: deletedService,
      });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete service", error });
  }
};

module.exports = {
  getAllServices,
  addService,
  updateService,
  deleteService,
};
