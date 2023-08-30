import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

const main = async () => {
	dotenv.config();

	const board1 = await prisma.board.create({
		data: {
			slug: 'b',
			name: 'Random'
		}
	});

	const board2 = await prisma.board.create({
		data: {
			slug: 'a',
			name: 'Anime'
		}
	});

	const board3 = await prisma.board.create({
		data: {
			slug: 'po',
			name: 'Politics'
		}
	});

	const board4 = await prisma.board.create({
		data: {
			slug: 'vg',
			name: 'Video Games'
		}
	});

	console.log(board1);
	console.log(board2);
	console.log(board3);
	console.log(board4);
};

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
