import { prisma } from "./prismaClient";


export async function pushCities() {
  // Egyptian country and its cities data
  const egyptData = {
    name: 'Egypt',
    cities: [
      'Cairo',
      'Alexandria',
      'Giza',
      'Sharm El Sheikh',
      'Luxor',
      'Aswan',
      'Port Said',
      'Tanta',
      'Ismailia',
      'Suez',
      'Mansoura',
      'Faiyum',
      'Damanhur',
      'Beni Suef',
      'Minya',
      'Sohag',
      'Qena',
      'New Valley',
      'Matruh',
      'Damietta',
    ],
  };

  // Create the country record for Egypt
  const egypt = await prisma.country.create({
    data: {
      name: egyptData.name,
    },
  });

  // Create cities associated with Egypt
  for (const cityName of egyptData.cities) {
    await prisma.city.create({
      data: {
        name: cityName,
        countryId: egypt.id,  // Reference the country's id
      },
    });
  }

  console.log('Egypt and its cities have been added to the database!');
}




export async function puchCategories() {
    // Sample gym-related categories and programs data
    const categories = [
      {
        name: 'Power Fitness',
        description: 'Strength-based programs focusing on building muscle and strength.',
        programs: [
          {
            name: 'Powerlifting',
            description: 'Focus on maximal strength in squats, deadlifts, and bench press.',
            duration: 60,
            pulse: 140,
            hertez: 50,
            createdById: 1,  // Assuming user with ID 1 exists
          },
          {
            name: 'Strength Training',
            description: 'A comprehensive strength training program targeting all major muscle groups.',
            duration: 45,
            pulse: 130,
            hertez: 55,
            createdById: 1,  // Assuming user with ID 1 exists
          },
        ],
      },
      {
        name: 'Bodybuilding',
        description: 'Programs focusing on muscle hypertrophy and physique development.',
        programs: [
          {
            name: 'Hypertrophy Training',
            description: 'A program designed to increase muscle size through high-volume training.',
            duration: 75,
            pulse: 130,
            hertez: 60,
            createdById: 1,  // Assuming user with ID 2 exists
          },
          {
            name: 'Cutting Program',
            description: 'A program designed for fat loss while maintaining muscle mass.',
            duration: 60,
            pulse: 150,
            hertez: 55,
            createdById: 1,  // Assuming user with ID 2 exists
          },
        ],
      },
      {
        name: 'Cardio',
        description: 'Programs focused on improving cardiovascular health and endurance.',
        programs: [
          {
            name: 'HIIT (High Intensity Interval Training)',
            description: 'Short bursts of high-intensity exercise followed by brief rest periods.',
            duration: 30,
            pulse: 160,
            hertez: 65,
            createdById: 1,  // Assuming user with ID 3 exists
          },
          {
            name: 'Running Program',
            description: 'Endurance training to improve running speed and stamina.',
            duration: 45,
            pulse: 145,
            hertez: 60,
            createdById: 1,  // Assuming user with ID 3 exists
          },
        ],
      },
      {
        name: 'CrossFit',
        description: 'A high-intensity workout combining elements of cardio, weightlifting, and gymnastics.',
        programs: [
          {
            name: 'WOD (Workout of the Day)',
            description: 'A varied workout that changes daily, incorporating different exercises.',
            duration: 60,
            pulse: 150,
            hertez: 70,
            createdById: 1,  // Assuming user with ID 4 exists
          },
          {
            name: 'Olympic Weightlifting',
            description: 'Focused on lifting techniques, including the clean and jerk, and snatch.',
            duration: 45,
            pulse: 140,
            hertez: 65,
            createdById: 1,  // Assuming user with ID 4 exists
          },
        ],
      },
      {
        name: 'Yoga',
        description: 'Mind-body programs designed to improve flexibility, balance, and mental wellness.',
        programs: [
          {
            name: 'Hatha Yoga',
            description: 'A slower-paced, beginner-friendly yoga style focusing on static poses.',
            duration: 60,
            pulse: 80,
            hertez: 40,
            createdById: 1,  // Assuming user with ID 5 exists
          },
          {
            name: 'Vinyasa Yoga',
            description: 'A faster-paced yoga class focused on fluid movement and linking breath with movement.',
            duration: 60,
            pulse: 85,
            hertez: 45,
            createdById: 1,  // Assuming user with ID 5 exists
          },
        ],
      },
      {
        name: 'Pilates',
        description: 'Programs focused on strengthening core muscles and improving posture and flexibility.',
        programs: [
          {
            name: 'Core Pilates',
            description: 'A Pilates program targeting the abdominal and lower back muscles.',
            duration: 45,
            pulse: 100,
            hertez: 50,
            createdById: 1,  // Assuming user with ID 6 exists
          },
          {
            name: 'Reformer Pilates',
            description: 'A Pilates program using a reformer machine for full-body strength and flexibility.',
            duration: 60,
            pulse: 95,
            hertez: 52,
            createdById: 1,  // Assuming user with ID 6 exists
          },
        ],
      },
    ];
  
    // Insert categories and their associated programs
    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
          programs: {
            create: categoryData.programs.map((programData) => ({
              name: programData.name,
              description: programData.description,
              duration: programData.duration,
              pulse: programData.pulse,
              hertez: programData.hertez,
              createdById: programData.createdById,
            })),
          },
        },
      });
  
      console.log(`Category created: ${category.name}`);
    }
  
    console.log('Gym categories and programs have been added to the database!');
  }


  export async function insertDiseases() {
    try {
      const diseases = [
        {
          name: 'heart disease',
          description: 'A contagious respiratory illness caused by influenza viruses.',
        },
        {
          name: 'Blood sugar',
          description: 'A chronic condition that affects how the body processes blood sugar.',
        },
        {
          name: 'Blood pressure',
          description: 'A condition in which the force of the blood against artery walls is too high.',
        },
      ];
  
      // Insert multiple rows into the Disease table
      const insertedDiseases = await prisma.disease.createMany({
        data: diseases,
        skipDuplicates: true, // Avoids throwing an error if a unique constraint is violated
      });
  
      console.log(`${insertedDiseases.count} diseases inserted successfully.`);
    } catch (error) {
      console.error('Error inserting diseases:', error);
    } finally {
      await prisma.$disconnect();
    }
  }


  export async function insertInjuries() {
    try {
      const injuries = [
        {
          name: 'Back pain',
          description: 'A break in the continuity of a bone.',
        },
        {
          name: 'Knee pain',
          description: 'A break in the continuity of a bone.',
        },
        {
          name: 'Sholder pain',
          description: 'A break in the continuity of a bone.',
        },
      ];
  
      // Insert multiple rows into the Injury table
      const insertedInjuries = await prisma.injury.createMany({
        data: injuries,
        skipDuplicates: true, // Avoids throwing an error if a unique constraint is violated
      });
  
      console.log(`${insertedInjuries.count} injuries inserted successfully.`);
    } catch (error) {
      console.error('Error inserting injuries:', error);
    } finally {
      await prisma.$disconnect();
    }
  }