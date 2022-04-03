import { Knex } from 'knex';

export const seed = async (knex: Knex) => {
  await knex('article').del();

  await knex('article').insert([
    {
      title: 'Article 01',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 02',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 03',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 04',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 05',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 06',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 07',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 08',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 09',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
    {
      title: 'Article 10',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure deserunt et eos molestiae, minus quia praesentium sint ducimus error. Magni ab at voluptate deserunt earum aspernatur amet accusamus, perspiciatis necessitatibus.',
    },
  ]);
};
