"use client";

import React from "react";
import { Text, View } from "react-native";

import Link from "next/link";

export default function NotFound() {
  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Not Found</Text>
      <Text>
        <Text>Return </Text>
        <Link href="/">
          <Text>home</Text>
        </Link>
        <Text>.</Text>
      </Text>
    </View>
  );
}
