import { User, UserRole } from "../types";

const SHEET_ID = '1YVZh5YvPL2piYOaMjucCS6-XREJHT65KxFlHZkTiUqI';
const SHEET_GID = '0'; // Default first sheet
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

export const fetchUsersFromSheet = async (): Promise<User[]> => {
  try {
    console.log("Fetching users from Google Sheet...");
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const text = await response.text();
    // Check if response is HTML (Login page redirect) which happens if sheet is private
    if (text.trim().startsWith('<!DOCTYPE html>')) {
      console.warn("Google Sheet is private. Please set 'General Access' to 'Anyone with the link'. Falling back to mock data.");
      return [];
    }

    return parseCSV(text);
  } catch (error) {
    console.error("Error loading users from sheet:", error);
    return [];
  }
};

const parseCSV = (csvText: string): User[] => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Get headers (lowercase for easier matching)
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const users: User[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex to split by comma but ignore commas inside quotes
    const currentLine = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    
    if (currentLine.length < 2) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      let value = currentLine[index]?.trim() || '';
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      row[header] = value;
    });

    // Map spreadsheet columns to User object
    const username = row['username'] || row['user'] || '';
    const password = row['password'] || row['pass'] || '123456';
    
    // COLUMN F: Subject (Mata Pelajaran)
    const subjectRaw = 
      row['subject'] || 
      row['mapel'] || 
      row['mata pelajaran'] || 
      (currentLine.length > 5 ? currentLine[5] : '') || 
      '';

    // COLUMN G: Grade (Kelas)
    const gradeRaw = 
      row['grade'] || 
      row['kelas'] || 
      row['class'] ||
      (currentLine.length > 6 ? currentLine[6] : '') ||
      '';

    const subject = subjectRaw.replace(/"/g, '').trim();
    const grade = gradeRaw.replace(/"/g, '').trim();
    
    if (username) {
      users.push({
        id: row['id'] || `sheet-${i}`,
        name: row['name'] || row['nama'] || username,
        role: mapRole(row['role'] || row['peran'] || row['jabatan']),
        email: row['email'] || `${username}@smart-ekselensia.id`,
        username: username,
        password: password,
        avatar: row['avatar'] || row['foto'] || `https://picsum.photos/200/200?random=${i}`,
        subject: subject, // Col F
        grade: grade      // Col G
      });
    }
  }

  return users;
};

const mapRole = (roleStr: string): UserRole => {
  if (!roleStr) return UserRole.STUDENT;
  
  const r = roleStr.toUpperCase().trim();
  
  if (r.includes('ADMIN')) return UserRole.ADMIN;
  if (r.includes('KEPALA') || r.includes('PRINCIPAL')) {
      if (r.includes('WAKIL') || r.includes('VICE')) return UserRole.VICE_PRINCIPAL;
      return UserRole.PRINCIPAL;
  }
  if (r.includes('GURU') || r.includes('TEACHER')) return UserRole.TEACHER;
  if (r.includes('SISWA') || r.includes('STUDENT') || r.includes('MURID')) return UserRole.STUDENT;
  
  return UserRole.STUDENT;
};