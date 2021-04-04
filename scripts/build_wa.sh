


find $(pwd)/src/wa -name "*.c" -print0  | while read -d $'\0' f; 
do 
filename="${f##*/}"
filename=${filename%.*}
 clang \
   --target=wasm32 \
   -O3 \
   -flto \
   -nostdlib \
   -Wl,--no-entry \
   -Wl,--export-all \
   -Wl,--lto-O3 \
   -o $(pwd)/assets/wa/$filename.wasm \
   $f;
#    -Wl,-z,stack-size=$[8 * 1024 * 1024] 
# clang \
#   --target=wasm32 \
#   -nostdlib \
#   -Wl,--no-entry \
#   -Wl,--export-all \
#   -o $(pwd)/assets/wa/$filename.wasm \
#   $f;
done