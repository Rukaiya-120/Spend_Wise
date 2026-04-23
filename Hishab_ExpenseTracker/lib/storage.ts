'use client';

// Mock types to maintain compatibility
export interface StorageUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

const STORAGE_KEY = 'hishab_db';

interface Database {
  users: Record<string, any>;
  groups: Record<string, any>;
  expenses: any[];
}

const getDB = (): Database => {
  if (typeof window === 'undefined') return { users: {}, groups: {}, expenses: [] };
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { users: {}, groups: {}, expenses: [] };
};

const saveDB = (db: Database) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

// Auth helpers
export const storageAuth = {
  signup: (email: string, pass: string, name: string) => {
    const db = getDB();
    if (Object.values(db.users).find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    const uid = Math.random().toString(36).substr(2, 9);
    const user = {
      uid,
      email,
      password: pass, // In a real app never store passwords in plain text!
      displayName: name,
      personalBudget: 0,
      createdAt: new Date().toISOString()
    };
    db.users[uid] = user;
    saveDB(db);
    localStorage.setItem('hishab_session', uid);
    return user;
  },
  login: (email: string, pass: string) => {
    const db = getDB();
    const user = Object.values(db.users).find(u => u.email === email && u.password === pass);
    if (!user) throw new Error('Invalid email or password');
    localStorage.setItem('hishab_session', user.uid);
    return user;
  },
  logout: () => {
    localStorage.removeItem('hishab_session');
  },
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const uid = localStorage.getItem('hishab_session');
    if (!uid) return null;
    const db = getDB();
    return db.users[uid] || null;
  }
};

// Firestore-like helpers
export const storageDB = {
  users: {
    get: (uid: string) => getDB().users[uid],
    update: (uid: string, data: any) => {
      const db = getDB();
      db.users[uid] = { ...db.users[uid], ...data };
      saveDB(db);
    }
  },
  groups: {
    add: (data: any) => {
      const db = getDB();
      const id = Math.random().toString(36).substr(2, 9);
      const newGroup = { ...data, id };
      db.groups[id] = newGroup;
      saveDB(db);
      return id;
    },
    get: (id: string) => getDB().groups[id],
    update: (id: string, data: any) => {
      const db = getDB();
      db.groups[id] = { ...db.groups[id], ...data };
      saveDB(db);
    },
    findByCode: (code: string) => {
      const db = getDB();
      return Object.values(db.groups).find((g: any) => g.code === code);
    },
    addMember: (groupId: string, member: any) => {
      const db = getDB();
      if (!db.groups[groupId].members) db.groups[groupId].members = {};
      db.groups[groupId].members[member.userId] = member;
      saveDB(db);
    }
  },
  expenses: {
    add: (data: any) => {
      const db = getDB();
      const id = Math.random().toString(36).substr(2, 9);
      db.expenses.push({ ...data, id });
      saveDB(db);
      return id;
    },
    list: (filters: any) => {
      const db = getDB();
      return db.expenses.filter(e => {
        if (filters.userId && e.userId !== filters.userId) return false;
        if (filters.groupId && e.groupId !== filters.groupId) return false;
        if (filters.type && e.type !== filters.type) return false;
        return true;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }
};
