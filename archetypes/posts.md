---
title: '{{ replace .Name "-" " " | strings.FirstUpper }}'
family: post
date: '{{ .Date }}'
author: ""
sidebar: true
crumbs:
  - title: Home
    url: "@root@"
  - title: Updates
    url: "@root@blog/"
  - title: '{{ replace .Name "-" " " | strings.FirstUpper }}'
---

