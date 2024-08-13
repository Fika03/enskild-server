import express, { Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import { IProduct } from "../types/Product";

const app = express();

app.use(express.static("public"));
app.use(express.json());

const dataPath = path.join(__dirname, "data", "data.json");

// GET route to fetch all data
app.get("/data", async (req: Request, res: Response) => {
  try {
    const jsonData = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(jsonData);
    res.json(data);
  } catch (error) {
    console.error("Error reading the file:", error);
    res.status(500).json({ error: "Failed to read the data file." });
  }
});

// GET SINGLE PRODUCT
app.get("/data/:id", async (req: Request, res: Response) => {
  try {
    const jsonData = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(jsonData);

    const id = JSON.parse(req.params.id);

    const item = data.find((item: IProduct) => item.id === id);

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: "Item not found." });
    }
  } catch (error) {
    console.error("Error reading the file:", error);
    res.status(500).json({ error: "Failed to retrieve the item." });
  }
});

// POST route to add a new item
app.post("/data", async (req: Request, res: Response) => {
  try {
    const jsonData = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(jsonData);

    const newItem = req.body;
    data.push(newItem);

    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error writing to the file:", error);
    res.status(500).json({ error: "Failed to add new item." });
  }
});

// PUT route to update an existing item by id
app.put("/data/:id", async (req: Request, res: Response) => {
  try {
    const jsonData = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(jsonData);

    const id = JSON.parse(req.params.id);
    const updatedItem = req.body;

    const index = data.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedItem };

      await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");

      res.json(data[index]);
    } else {
      res.status(404).json({ error: "Item not found." });
    }
  } catch (error) {
    console.error("Error updating the file:", error);
    res.status(500).json({ error: "Failed to update item." });
  }
});

// DELETE route to remove an item by id
app.delete("/data/:id", async (req: Request, res: Response) => {
  try {
    const jsonData = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(jsonData);
    const id = JSON.parse(req.params.id);

    const newData = data.filter((item: any) => item.id !== id);

    if (newData.length !== data.length) {
      await fs.writeFile(dataPath, JSON.stringify(newData, null, 2), "utf-8");

      res.status(200).json({ message: "Item deleted successfully." });
    } else {
      res.status(404).json({ error: "Item not found." });
    }
  } catch (error) {
    console.error("Error deleting from the file:", error);
    res.status(500).json({ error: "Failed to delete item." });
  }
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
