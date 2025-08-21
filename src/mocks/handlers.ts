import { http, HttpResponse } from 'msw';
import { mockUsers, mockCategories, mockPriorities, mockTickets, mockMessages } from './data';
import { User, Ticket, TicketMessage, Role } from '../types';

// In-memory storage for runtime data
let users = [...mockUsers];
let categories = [...mockCategories];
let priorities = [...mockPriorities];
let tickets = [...mockTickets];
let messages = [...mockMessages];

export const handlers = [
  // Authentication
  http.post('/api/login', async ({ request }) => {
    const { email, role } = await request.json() as { email: string; role: string };
    console.log('Login attempt:', { email, role });
    console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
    
    const user = users.find(u => u.email === email && u.role === role);
    console.log('Found user:', user);
    
    if (user) {
      console.log('Login successful for:', user.name);
      return HttpResponse.json({
        token: `fake-token-${user.id}`,
        user
      });
    }
    
    console.log('Login failed - no matching user found');
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  http.post('/api/signup', async ({ request }) => {
    const { name, email, phone, role } = await request.json() as { 
      name: string; 
      email: string; 
      phone?: string; 
      role: string;
    };
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return HttpResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: role as Role,
      department: role === 'staff' ? 'General Support' : undefined
    };
    
    users.push(newUser);
    
    return HttpResponse.json({
      token: `fake-token-${newUser.id}`,
      user: newUser
    }, { status: 201 });
  }),

  http.get('/api/me', ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = token.replace('fake-token-', '');
    const user = users.find(u => u.id === userId);
    
    if (user) {
      return HttpResponse.json({ user });
    }
    
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }),

  // Categories
  http.get('/api/categories', () => {
    console.log('Categories requested:', categories);
    return HttpResponse.json(categories);
  }),

  http.post('/api/categories', async ({ request }) => {
    const newCategory = await request.json() as Omit<typeof categories[0], 'id'>;
    const category = {
      id: Date.now().toString(),
      ...newCategory
    };
    categories.push(category);
    return HttpResponse.json(category, { status: 201 });
  }),

  http.put('/api/categories/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json() as Partial<typeof categories[0]>;
    const index = categories.findIndex(c => c.id === id);
    
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedData };
      return HttpResponse.json(categories[index]);
    }
    
    return HttpResponse.json({ error: 'Category not found' }, { status: 404 });
  }),

  http.delete('/api/categories/:id', ({ params }) => {
    const { id } = params;
    const index = categories.findIndex(c => c.id === id);
    
    if (index !== -1) {
      categories.splice(index, 1);
      return HttpResponse.json({ success: true });
    }
    
    return HttpResponse.json({ error: 'Category not found' }, { status: 404 });
  }),

  // Priorities
  http.get('/api/priorities', () => {
    return HttpResponse.json(priorities);
  }),

  http.post('/api/priorities', async ({ request }) => {
    const newPriority = await request.json() as Omit<typeof priorities[0], 'id'>;
    const priority = {
      id: Date.now().toString(),
      ...newPriority
    };
    priorities.push(priority);
    return HttpResponse.json(priority, { status: 201 });
  }),

  http.put('/api/priorities/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json() as Partial<typeof priorities[0]>;
    const index = priorities.findIndex(p => p.id === id);
    
    if (index !== -1) {
      priorities[index] = { ...priorities[index], ...updatedData };
      return HttpResponse.json(priorities[index]);
    }
    
    return HttpResponse.json({ error: 'Priority not found' }, { status: 404 });
  }),

  http.delete('/api/priorities/:id', ({ params }) => {
    const { id } = params;
    const index = priorities.findIndex(p => p.id === id);
    
    if (index !== -1) {
      priorities.splice(index, 1);
      return HttpResponse.json({ success: true });
    }
    
    return HttpResponse.json({ error: 'Priority not found' }, { status: 404 });
  }),

  // Users/Staff
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    
    let filteredUsers = users;
    if (role) {
      filteredUsers = users.filter(u => u.role === role);
    }
    
    return HttpResponse.json(filteredUsers);
  }),

  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json() as Omit<User, 'id'>;
    const user = {
      id: Date.now().toString(),
      ...newUser
    };
    users.push(user);
    return HttpResponse.json(user, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json() as Partial<User>;
    const index = users.findIndex(u => u.id === id);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      return HttpResponse.json(users[index]);
    }
    
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    const index = users.findIndex(u => u.id === id);
    
    if (index !== -1) {
      users.splice(index, 1);
      return HttpResponse.json({ success: true });
    }
    
    return HttpResponse.json({ error: 'User not found' }, { status: 404 });
  }),

  // Tickets
  http.get('/api/tickets', ({ request }) => {
    const url = new URL(request.url);
    const mine = url.searchParams.get('mine') === 'true';
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const assignee = url.searchParams.get('assignee');
    const priority = url.searchParams.get('priority');
    const q = url.searchParams.get('q');
    
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const userId = token?.replace('fake-token-', '');
    
    let filteredTickets = tickets;
    
    if (mine && userId) {
      filteredTickets = tickets.filter(t => t.customerId === userId);
    }
    
    if (status) {
      filteredTickets = filteredTickets.filter(t => t.status === status);
    }
    
    if (category) {
      filteredTickets = filteredTickets.filter(t => t.categoryId === category);
    }
    
    if (assignee) {
      filteredTickets = filteredTickets.filter(t => t.assignedStaffId === assignee);
    }
    
    if (priority) {
      filteredTickets = filteredTickets.filter(t => t.priority === priority);
    }
    
    if (q) {
      filteredTickets = filteredTickets.filter(t => 
        t.subject.toLowerCase().includes(q.toLowerCase()) ||
        t.id.toLowerCase().includes(q.toLowerCase()) ||
        t.description.toLowerCase().includes(q.toLowerCase())
      );
    }
    
    return HttpResponse.json(filteredTickets);
  }),

  http.post('/api/tickets', async ({ request }) => {
    const ticketData = await request.json() as Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
    const ticket: Ticket = {
      id: `T${String(tickets.length + 1).padStart(3, '0')}`,
      ...ticketData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tickets.push(ticket);
    
    // Create initial message
    const message: TicketMessage = {
      id: Date.now().toString(),
      ticketId: ticket.id,
      senderId: ticket.customerId,
      message: ticket.description,
      createdAt: ticket.createdAt
    };
    messages.push(message);
    
    return HttpResponse.json(ticket, { status: 201 });
  }),

  http.get('/api/tickets/:id', ({ params }) => {
    const { id } = params;
    const ticket = tickets.find(t => t.id === id);
    
    if (!ticket) {
      return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    
    const ticketMessages = messages.filter(m => m.ticketId === id);
    
    return HttpResponse.json({
      ticket,
      messages: ticketMessages
    });
  }),

  http.patch('/api/tickets/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as Partial<Ticket>;
    const index = tickets.findIndex(t => t.id === id);
    
    if (index !== -1) {
      tickets[index] = {
        ...tickets[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return HttpResponse.json(tickets[index]);
    }
    
    return HttpResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }),

  // Messages
  http.post('/api/tickets/:id/messages', async ({ params, request }) => {
    const { id } = params;
    const messageData = await request.json() as Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt'>;
    
    const message: TicketMessage = {
      id: Date.now().toString(),
      ticketId: id as string,
      ...messageData,
      createdAt: new Date().toISOString()
    };
    
    messages.push(message);
    
    // Update ticket's updatedAt timestamp
    const ticketIndex = tickets.findIndex(t => t.id === id);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].updatedAt = new Date().toISOString();
    }
    
    return HttpResponse.json(message, { status: 201 });
  }),

  // Internal Notes (same endpoint as messages but with isInternal flag)
  http.post('/api/tickets/:id/notes', async ({ params, request }) => {
    const { id } = params;
    const noteData = await request.json() as Omit<TicketMessage, 'id' | 'ticketId' | 'createdAt' | 'isInternal'>;
    
    const note: TicketMessage = {
      id: Date.now().toString(),
      ticketId: id as string,
      ...noteData,
      isInternal: true,
      createdAt: new Date().toISOString()
    };
    
    messages.push(note);
    
    return HttpResponse.json(note, { status: 201 });
  })
];