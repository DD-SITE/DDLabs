/* eslint-disable import/order */
"use server";

import { ID, InputFile, Query } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";

interface CreateUserParams {
  email: string;
  phone: string;
  name: string;
}

interface RegisterPatientParams {
  userId: string;
  name: string;
  age: number;
  gender: string;
  identificationDocument?: FormData;
}

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error: any) {
    if (error?.code === 409) {
      const existingUser = await users.list([Query.equal("email", [user.email])]);
      return existingUser.users[0];
    }
    console.error("Failed to create user:", error);
  }
};

// GET USER DETAILS
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
};

// REGISTER NEW PATIENT
export const registerPatient = async ({
  identificationDocument,
  userId,
  ...patient
}: RegisterPatientParams) => {
  try {
    let fileId = null;
    let fileUrl = null;

    if (identificationDocument) {
      const inputFile = InputFile.fromBlob(
        identificationDocument.get("blobFile") as Blob,
        identificationDocument.get("fileName") as string
      );

      const file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
      fileId = file.$id;
      fileUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`;
    }

    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        identificationDocumentId: fileId,
        identificationDocumentUrl: fileUrl,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("Failed to register patient:", error);
  }
};

// GET PATIENT DETAILS
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error("Failed to fetch patient:", error);
  }
};
