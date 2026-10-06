import os

def replace_in_file(file_path, old_str, new_str):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if old_str in content:
            new_content = content.replace(old_str, new_str)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

def main():
    root_dir = r'c:\Users\vsair\Downloads\novasquar-main\novasquad-main\jobninjas\frontend\src'
    replacements = [
        ('--jobninjas-', '--jobninjas-'),
        ('JobNinjas', 'JobNinjas'),
        ('jobninjas', 'jobninjas')
    ]
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css', '.html')):
                file_path = os.path.join(root, file)
                for old_s, new_s in replacements:
                    replace_in_file(file_path, old_s, new_s)

if __name__ == "__main__":
    main()
