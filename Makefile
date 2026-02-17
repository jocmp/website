MP4S := $(shell find static/uploads -name '*.mp4')
WEBMS := $(MP4S:.mp4=.webm)

.PHONY: dev webm

webm: $(WEBMS)

dev:
	hugo server

%.webm: %.mp4
	ffmpeg -i $< -c:v libvpx-vp9 -crf 30 -b:v 0 -an $@
