# synth-web-app
## A coursework project and no more

This project performs voice synthesis on the server using the [Silero](https://github.com/snakers4/silero-models). It also has problems with multithreading and performance.


## Installation and Run

This app requires [Python](https://www.python.org/downloads/) v3.0+ to run.

Install the dependencies and start the server.

```sh
cd synth-web-app
pip install -r requirements.txt
flask run
```
I will also note that there is no explicit indication of versions in the dependencies, which will probably lead to a crash in the future.
