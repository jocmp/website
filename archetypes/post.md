---
title: '{{ replace .Name "-" " " | title }}'
summary: ''
date: {{ now.Format "2006-01-02T15:04:05-07:00" }}
type: post
url: "/{{ now.Format "2006/01/02" }}/{{ .Name }}/"
---
