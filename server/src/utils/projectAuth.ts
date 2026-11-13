import mongoose from 'mongoose';
import { Project, IProject } from '../models/Project';

export interface ProjectAuthResult {
  project: IProject | null;
  status: 200 | 400 | 403 | 404;
  error?: string;
}

/**
 * Validates entity ID format, existence, and user ownership for OWASP BOLA / IDOR protection.
 */
export async function findUserProject(
  id: string | string[] | undefined,
  userId: string | string[] | undefined
): Promise<ProjectAuthResult> {
  const idStr = Array.isArray(id) ? id[0] : id;
  const userIdStr = Array.isArray(userId) ? userId[0] : userId;

  if (!idStr || idStr === 'demo' || !mongoose.Types.ObjectId.isValid(idStr)) {
    return {
      project: null,
      status: 404,
      error: 'Project workspace not found or invalid identifier format'
    };
  }

  const project = await Project.findById(idStr);
  if (!project) {
    return {
      project: null,
      status: 404,
      error: 'Project workspace not found'
    };
  }

  if (!userIdStr || project.userId.toString() !== userIdStr.toString()) {
    return {
      project: null,
      status: 403,
      error: 'Access Denied: You do not have permission to view or modify this research workspace'
    };
  }

  return { project, status: 200 };
}
