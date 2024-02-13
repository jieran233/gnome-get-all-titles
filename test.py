import subprocess
import time
import ast

output_left = ['(', '(@as']
output_right = ',)'

def poll_system_command(command):
    while True:
        try:
            # Use subprocess.Popen to start the system command and capture its output through stdout=subprocess.PIPE
            process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            while True:
                #Read command output
                output = process.stdout.readline()
                if not output:
                    break
                output = output.decode().strip()  # Remove newlines from output and print
                print(output)
                for lstrip in output_left:
                    output = output.lstrip(lstrip)
                output = output.rstrip(output_right)
                output = output.strip()

                windows = ast.literal_eval(output)
                print(windows)
                
            # Wait for the command to complete
            process.wait()
        except Exception as e:
            print("Error:", e)
        time.sleep(0.1)

title = "DeaDBeeF"
command = "gdbus call --session --dest org.gnome.Shell --object-path /io/github/jieran233/GetAllTitlesOfWindows --method io.github.jieran233.GetAllTitlesOfWindows.getWindowsBySubstring '{}'".format(title)
poll_system_command(command)
