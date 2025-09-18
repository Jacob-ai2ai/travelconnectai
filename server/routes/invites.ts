import { RequestHandler } from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

export const handleCreateInvites: RequestHandler = async (req, res) => {
  try {
    const { propertyName, role, managers = [], cohosts = [] } = req.body;
    if (!propertyName) return res.status(400).json({ error: "propertyName is required" });

    const dataDir = join(process.cwd(), "data");
    if (!existsSync(dataDir)) mkdirSync(dataDir);

    const filePath = join(dataDir, "invites.json");
    let invites: any[] = [];
    if (existsSync(filePath)) {
      try {
        invites = JSON.parse(readFileSync(filePath, "utf-8") || "[]");
      } catch (e) {
        invites = [];
      }
    }

    const timestamp = new Date().toISOString();
    const record = {
      id: `${Date.now()}`,
      propertyName,
      role,
      managers,
      cohosts,
      createdAt: timestamp,
    };

    invites.push(record);
    writeFileSync(filePath, JSON.stringify(invites, null, 2));

    // Simulate sending invites by returning them with sent=false
    const result = {
      success: true,
      record,
      message: "Invites saved. (Email sending simulated)",
    };

    return res.json(result);
  } catch (error) {
    console.error("Invite creation error:", error);
    return res.status(500).json({ error: "Failed to create invites" });
  }
};
