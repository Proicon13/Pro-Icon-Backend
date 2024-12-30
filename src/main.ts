import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as dotenv from "dotenv";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import * as morgan from "morgan";
import { insertDiseases, insertInjuries, puchCategories, pushCities } from "./utils/pushCities";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Pro-Icon")
    .setDescription("The Pro-Icon API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Strip properties that are not part of the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      validationError: {
        target: false, // Do not expose the raw object in validation errors
        value: false, // Do not expose the raw value in validation errors
      },
    })
  );

  // Apply the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable CORS for all origins
  app.enableCors({
    origin: true, // Allow all origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type, Authorization", // Allowed headers
    credentials: true, // Allow cookies and authorization headers
  });

  app.use(morgan("combined"));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
