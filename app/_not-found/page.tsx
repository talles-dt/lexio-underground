import React from "react";
("use client");

import { Text } from "react-native";

import { type Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "Lexio Underground",
};

export default function NotFound() {
  return (
    <div>
      <Text>
        <h1>
          <Text>Not Found</Text>
        </h1>
      </Text>
      <Text>
        <Text>Return</Text>
        <a href="/">
          <Text>home</Text>
        </a>
        <Text>.</Text>
      </Text>
    </div>
  );
}
