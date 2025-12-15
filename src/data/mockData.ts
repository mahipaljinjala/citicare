import { Complaint, User, Notification, Department, Ward, PublicDocument, PublicProject } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@email.com',
  role: 'citizen',
  avatar: '',
  ward: 'Ward 12',
};

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-2024-001',
    title: 'Pothole on Main Street',
    description: 'Large pothole near the bus stop causing traffic issues and accidents. Needs immediate repair.',
    category: 'roads',
    status: 'in_progress',
    priority: 'high',
    location: {
      address: '45 Main Street, Near City Mall',
      ward: 'Ward 12',
      lat: 28.6139,
      lng: 77.2090,
    },
    images: [],
    citizenId: '1',
    citizenName: 'Rajesh Kumar',
    assignedOfficerId: 'off-1',
    assignedOfficerName: 'Amit Sharma',
    department: 'Roads & Infrastructure',
    createdAt: '2024-01-10T10:30:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    timeline: [
      { id: '1', status: 'submitted', message: 'Complaint submitted by citizen', timestamp: '2024-01-10T10:30:00Z', userId: '1', userName: 'Rajesh Kumar' },
      { id: '2', status: 'in_review', message: 'Complaint assigned to Roads department', timestamp: '2024-01-10T11:00:00Z', userId: 'sys', userName: 'System' },
      { id: '3', status: 'in_progress', message: 'Repair work scheduled for tomorrow', timestamp: '2024-01-12T14:20:00Z', userId: 'off-1', userName: 'Amit Sharma' },
    ],
    comments: [
      { id: '1', message: 'Thank you for reporting. We have prioritized this issue.', timestamp: '2024-01-11T09:00:00Z', userId: 'off-1', userName: 'Amit Sharma', userRole: 'officer', isInternal: false },
    ],
  },
  {
    id: 'CMP-2024-002',
    title: 'Water Supply Disruption',
    description: 'No water supply in our area for the past 2 days. Multiple households affected.',
    category: 'water',
    status: 'resolved',
    priority: 'urgent',
    location: {
      address: 'Block C, Sector 15',
      ward: 'Ward 12',
      lat: 28.6200,
      lng: 77.2150,
    },
    images: [],
    citizenId: '1',
    citizenName: 'Rajesh Kumar',
    assignedOfficerId: 'off-2',
    assignedOfficerName: 'Priya Verma',
    department: 'Water Supply',
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-07T16:00:00Z',
    resolvedAt: '2024-01-07T16:00:00Z',
    timeline: [
      { id: '1', status: 'submitted', message: 'Complaint submitted by citizen', timestamp: '2024-01-05T08:00:00Z', userId: '1', userName: 'Rajesh Kumar' },
      { id: '2', status: 'in_review', message: 'Assigned to Water Supply department', timestamp: '2024-01-05T09:00:00Z', userId: 'sys', userName: 'System' },
      { id: '3', status: 'in_progress', message: 'Team dispatched to check main pipeline', timestamp: '2024-01-06T10:00:00Z', userId: 'off-2', userName: 'Priya Verma' },
      { id: '4', status: 'resolved', message: 'Pipeline repaired, water supply restored', timestamp: '2024-01-07T16:00:00Z', userId: 'off-2', userName: 'Priya Verma' },
    ],
    comments: [],
    rating: 4,
    feedback: 'Good response time. Thank you!',
  },
  {
    id: 'CMP-2024-003',
    title: 'Garbage Not Collected',
    description: 'Garbage has not been collected from our street for a week. Health hazard situation.',
    category: 'garbage',
    status: 'submitted',
    priority: 'medium',
    location: {
      address: '78 Park Avenue',
      ward: 'Ward 12',
      lat: 28.6180,
      lng: 77.2100,
    },
    images: [],
    citizenId: '1',
    citizenName: 'Rajesh Kumar',
    department: 'Sanitation',
    createdAt: '2024-01-14T07:00:00Z',
    updatedAt: '2024-01-14T07:00:00Z',
    timeline: [
      { id: '1', status: 'submitted', message: 'Complaint submitted by citizen', timestamp: '2024-01-14T07:00:00Z', userId: '1', userName: 'Rajesh Kumar' },
    ],
    comments: [],
  },
  {
    id: 'CMP-2024-004',
    title: 'Street Light Not Working',
    description: 'Street light at the corner of MG Road has been off for 3 days. Safety concern at night.',
    category: 'street_lights',
    status: 'in_review',
    priority: 'medium',
    location: {
      address: 'MG Road Corner, Near Temple',
      ward: 'Ward 12',
      lat: 28.6150,
      lng: 77.2080,
    },
    images: [],
    citizenId: '1',
    citizenName: 'Rajesh Kumar',
    department: 'Electricity',
    createdAt: '2024-01-13T18:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
    timeline: [
      { id: '1', status: 'submitted', message: 'Complaint submitted by citizen', timestamp: '2024-01-13T18:00:00Z', userId: '1', userName: 'Rajesh Kumar' },
      { id: '2', status: 'in_review', message: 'Assigned to Electricity department', timestamp: '2024-01-14T09:00:00Z', userId: 'sys', userName: 'System' },
    ],
    comments: [],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Status Updated',
    message: 'Your complaint CMP-2024-001 is now in progress',
    type: 'status_update',
    read: false,
    timestamp: '2024-01-12T14:20:00Z',
    complaintId: 'CMP-2024-001',
  },
  {
    id: '2',
    title: 'New Comment',
    message: 'Officer Amit Sharma commented on your complaint',
    type: 'comment',
    read: false,
    timestamp: '2024-01-11T09:00:00Z',
    complaintId: 'CMP-2024-001',
  },
  {
    id: '3',
    title: 'Complaint Resolved',
    message: 'Your complaint CMP-2024-002 has been resolved',
    type: 'status_update',
    read: true,
    timestamp: '2024-01-07T16:00:00Z',
    complaintId: 'CMP-2024-002',
  },
];

export const mockDepartments: Department[] = [
  { id: '1', name: 'Roads & Infrastructure', description: 'Road maintenance, construction, and repairs', headId: 'dh-1', headName: 'Dr. Vikram Singh', totalComplaints: 245, resolvedComplaints: 198, avgResolutionTime: 4.5 },
  { id: '2', name: 'Water Supply', description: 'Water distribution and pipeline maintenance', headId: 'dh-2', headName: 'Mrs. Anita Reddy', totalComplaints: 189, resolvedComplaints: 167, avgResolutionTime: 2.8 },
  { id: '3', name: 'Electricity', description: 'Street lights and electrical infrastructure', headId: 'dh-3', headName: 'Mr. Suresh Iyer', totalComplaints: 156, resolvedComplaints: 142, avgResolutionTime: 1.5 },
  { id: '4', name: 'Sanitation', description: 'Garbage collection and waste management', headId: 'dh-4', headName: 'Mr. Ramesh Patil', totalComplaints: 312, resolvedComplaints: 289, avgResolutionTime: 1.2 },
  { id: '5', name: 'Parks & Recreation', description: 'Public parks and recreational facilities', headId: 'dh-5', headName: 'Mrs. Lakshmi Nair', totalComplaints: 78, resolvedComplaints: 71, avgResolutionTime: 5.2 },
];

export const mockWards: Ward[] = [
  { id: '1', name: 'Ward 1', zone: 'North Zone', totalComplaints: 145, activeComplaints: 23 },
  { id: '2', name: 'Ward 2', zone: 'North Zone', totalComplaints: 132, activeComplaints: 18 },
  { id: '3', name: 'Ward 12', zone: 'Central Zone', totalComplaints: 178, activeComplaints: 31 },
  { id: '4', name: 'Ward 15', zone: 'South Zone', totalComplaints: 156, activeComplaints: 27 },
];

export const mockDocuments: PublicDocument[] = [
  { id: '1', title: 'Municipal Budget 2024-25', category: 'Budget', fileUrl: '#', uploadedAt: '2024-01-01', downloads: 1245 },
  { id: '2', title: 'Tender Notice - Road Construction', category: 'Tenders', fileUrl: '#', uploadedAt: '2024-01-10', downloads: 567 },
  { id: '3', title: 'Water Conservation Guidelines', category: 'Policies', fileUrl: '#', uploadedAt: '2024-01-05', downloads: 890 },
  { id: '4', title: 'Waste Management Policy', category: 'Policies', fileUrl: '#', uploadedAt: '2023-12-15', downloads: 432 },
];

export const mockProjects: PublicProject[] = [
  { id: '1', title: 'Smart Street Lighting Project', description: 'Installation of LED street lights with smart sensors', department: 'Electricity', ward: 'All Wards', budget: 50000000, progress: 65, startDate: '2023-06-01', endDate: '2024-06-01', status: 'in_progress' },
  { id: '2', title: 'Main Road Widening', description: 'Widening of MG Road from 4 lanes to 6 lanes', department: 'Roads & Infrastructure', ward: 'Ward 12', budget: 120000000, progress: 40, startDate: '2023-09-01', endDate: '2024-12-31', status: 'in_progress' },
  { id: '3', title: 'New Water Treatment Plant', description: 'Construction of water treatment facility', department: 'Water Supply', ward: 'Ward 8', budget: 80000000, progress: 100, startDate: '2022-01-01', endDate: '2023-12-31', status: 'completed' },
];

export const complaintCategories = [
  { value: 'roads', label: 'Roads & Potholes', icon: '🛣️' },
  { value: 'water', label: 'Water Supply', icon: '💧' },
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'garbage', label: 'Garbage Collection', icon: '🗑️' },
  { value: 'sewage', label: 'Sewage & Drainage', icon: '🚰' },
  { value: 'street_lights', label: 'Street Lights', icon: '💡' },
  { value: 'parks', label: 'Parks & Gardens', icon: '🌳' },
  { value: 'other', label: 'Other Issues', icon: '📋' },
];
