import { describe, it, expect, vi } from 'vitest';
import mongoose from 'mongoose';
import { findUserProject } from '../utils/projectAuth';
import { Project } from '../models/Project';

describe('API Route Security & IDOR Authorization Tests', () => {
  it('should cleanly return 404 for malformed or demo identifiers without throwing CastError', async () => {
    const res1 = await findUserProject('demo', 'user123');
    expect(res1.status).toBe(404);
    expect(res1.project).toBeNull();

    const res2 = await findUserProject('invalid-short-id', 'user123');
    expect(res2.status).toBe(404);
    expect(res2.project).toBeNull();

    const res3 = await findUserProject('', 'user123');
    expect(res3.status).toBe(404);
  });

  it('should return 404 if project does not exist in database', async () => {
    const validNonExistentId = new mongoose.Types.ObjectId().toString();
    vi.spyOn(Project, 'findById').mockResolvedValueOnce(null as any);

    const res = await findUserProject(validNonExistentId, 'user123');
    expect(res.status).toBe(404);
    expect(res.project).toBeNull();
  });

  it('should return 403 Forbidden when requesting user does not own the project (IDOR guard)', async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    const ownerUserId = new mongoose.Types.ObjectId();
    const attackerUserId = new mongoose.Types.ObjectId().toString();

    vi.spyOn(Project, 'findById').mockResolvedValueOnce({
      _id: projectId,
      userId: ownerUserId,
      title: 'Victim Proposal'
    } as any);

    const res = await findUserProject(projectId, attackerUserId);
    expect(res.status).toBe(403);
    expect(res.project).toBeNull();
    expect(res.error).toContain('Access Denied');
  });

  it('should return 200 and the project when requesting user is the verified owner', async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    const ownerUserId = new mongoose.Types.ObjectId();

    const mockProject = {
      _id: projectId,
      userId: ownerUserId,
      title: 'Valid Academic Proposal'
    };

    vi.spyOn(Project, 'findById').mockResolvedValueOnce(mockProject as any);

    const res = await findUserProject(projectId, ownerUserId.toString());
    expect(res.status).toBe(200);
    expect(res.project).toEqual(mockProject);
  });
});

