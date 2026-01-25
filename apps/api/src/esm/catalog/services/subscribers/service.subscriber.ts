import { EventArgs, EventSubscriber } from '@mikro-orm/core';
import { Service } from '../entities/service.entity';

export class ServiceSubscriber implements EventSubscriber<Service> {
  getSubscribedEntities() {
    return [Service];
  }

  async beforeCreate(args: EventArgs<Service>) {
    const { entity, em } = args;

    // Skip if code is already set
    if (entity.code) {
      return;
    }

    const repo = em.getRepository(Service);

    // Find the latest service with SRV code
    // We order by code descending to get the highest number
    const lastService = await repo.findOne(
      { code: { $like: 'SRV-%' } },
      { orderBy: { code: 'DESC' } },
    );

    let nextNum = 1;
    if (lastService && lastService.code) {
      const numStr = lastService.code.replace('SRV-', '');
      const lastNum = parseInt(numStr, 10);
      if (!isNaN(lastNum)) {
        nextNum = lastNum + 1;
      }
    }

    // Format: SRV-001
    entity.code = `SRV-${String(nextNum).padStart(3, '0')}`;
  }
}
