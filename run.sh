if ! jekyll -v  &> /dev/null
then
    sudo apt install jekyll -y
fi
jekyll serve --trace
