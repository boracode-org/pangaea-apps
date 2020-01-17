import Link from "next/link";
import { View, Text, Button, ScrollView } from "react-native-web";
import * as React from "react";
import { Database } from "./Database";

export const Header = ({ url }: { url: string }) => (
  <View
    style={{
      flexDirection: "row",
      flex: 1,
      width: "100%",
      justifyContent: "space-between",
      backgroundColor: "lightgray",
      padding: 5
    }}
  >
    <Text
      style={{
        backgroundColor: "darkred",
        color: "white",
        fontSize: 20,
        padding: 4,
        borderRadius: 3,
        margin: 2
      }}
    >
      {url.replace("/", "").toUpperCase() || "HOME"}
    </Text>
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "lightgray"
      }}
    >
      {!Database.isLoggedIn ? (
        <Link href="/login" prefetch>
          <a
            style={{
              backgroundColor: "yellow",
              fontSize: 20,
              padding: 4,
              borderRadius: 3,
              margin: 2
            }}
          >
            LOGIN
          </a>
        </Link>
      ) : null}
      {Database.isLoggedIn ? (
        <View style={{flex:1, flexDirection:"row"}}>
          <Link href="/" prefetch>
            <a
              style={{
                backgroundColor: "white",
                fontSize: 20,
                padding: 4,
                borderRadius: 3,
                margin: 2
              }}
            >
              HOME
            </a>
          </Link>
          <Link href="/scheduler" prefetch>
            <a
              style={{
                backgroundColor: "white",
                fontSize: 20,
                padding: 4,
                borderRadius: 3,
                margin: 2
              }}
            >
              SCHED.
            </a>
          </Link>
          <Link href="/devices" prefetch>
            <a
              style={{
                backgroundColor: "white",
                fontSize: 20,
                padding: 4,
                borderRadius: 3,
                margin: 2
              }}
            >
              DEVICES
            </a>
          </Link>
          <Link href="/groups" prefetch>
            <a
              style={{
                backgroundColor: "white",
                fontSize: 20,
                padding: 4,
                borderRadius: 3,
                margin: 2
              }}
            >
              GROUPS
            </a>
          </Link>
          <Link href="/logout" prefetch>
            <a
              style={{
                backgroundColor: "orange",
                fontSize: 20,
                padding: 4,
                borderRadius: 3,
                margin: 2
              }}
            >
              LOGOUT
            </a>
          </Link>
        </View>
      ) : null}
    </View>
  </View>
);
