import { useMyColorStore } from "@/store/myColorStore";
import Image from "next/image";
import React from "react";

export const HelpWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <h2
        className="text-2xl font-bold space-y-2"
        style={{ margin: "3rem auto" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-2 items-start">{children}</div>
    </div>
  );
};

export const HelpWrapperItem = ({
  children,
  step,
}: {
  children: React.ReactNode;
  step: number;
}) => {
  const { textColorA } = useMyColorStore();
  return (
    <div className="flex flex-col gap-2 items-start my-4">
      <div
        className="w-10 h-10  rounded-full flex items-center justify-center"
        style={{ border: `1px solid ${textColorA}` }}
      >
        {step}
      </div>
      {children}
    </div>
  );
};

export const HelpImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "50vw",
        height: "30vh",
        maxHeight: "90vh",
      }}
    >
      <Image src={src} alt={alt} fill className="object-contain" />
    </div>
  );
};
