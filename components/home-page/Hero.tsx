import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Image from "next/image";
import SparklesText from "../magicui/sparkles-text";

export default function Hero() {
  return (
    <section className="max-w-screen-xl mx-auto py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-6 text-center">
          <Image
            src="/small-logo.svg"
            width={100}
            height={100}
            alt="StudyGen AI Logo"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl  text-balance">
              Master Your Studies with{" "}
              <SparklesText
                text="AI-Powered"
                className="inline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
              />{" "}
              Precision
            </h1>
            <p className="text-gray-500 md:text-xl dark:text-gray-400">
              Unlock your academic potential with StudyGen AI, the ultimate
              study companion powered by Google&apos;s Gemini API.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row w-full sm:w-fit">
            <Link href="#" className={buttonVariants()} prefetch={false}>
              Get Started Free
            </Link>
            <Link
              href="#"
              className={buttonVariants({ variant: "outline" })}
              prefetch={false}
            >
              Learn More
            </Link>
          </div>
        </div>
        <Image
          src="/hero-image-studygen.png"
          width={1200}
          height={1200}
          alt="StudyGen AI Hero Image"
          className="mx-auto rounded-lg lg:mt-20 mt-8 w-full lg:h-[600px] object-cover object-top"
        />
      </div>
    </section>
  );
}
