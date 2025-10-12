import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import csv
import pandas as pd
import pyperclip
import threading

class CSVConverterGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("CSV Converter for kehilot.csv")
        self.root.geometry("2400x1300")
        
        # Data storage
        self.original_data = None
        self.converted_data = None
        self.df = None
        self.input_file_path = None  # Store the input file path
        self.input_format = "unknown"  # Format detection: "input", "kehilot", "unknown"
        
        self.setup_ui()
        
    def setup_ui(self):
        # Main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Configure grid weights
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(1, weight=1)
        
        # File selection frame
        file_frame = ttk.LabelFrame(main_frame, text="File Selection", padding="5")
        file_frame.grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # File selection button
        select_btn = ttk.Button(file_frame, text="Select CSV File", command=self.select_file)
        select_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # File label
        self.file_label = ttk.Label(file_frame, text="No file selected")
        self.file_label.pack(side=tk.LEFT)
        
        # Convert button
        convert_btn = ttk.Button(file_frame, text="Convert Data", command=self.convert_data)
        convert_btn.pack(side=tk.LEFT, padx=(20, 0))
        
        # Progress bar
        self.progress = ttk.Progressbar(file_frame, mode='indeterminate')
        self.progress.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Data display frame
        data_frame = ttk.LabelFrame(main_frame, text="Converted Data (Double-click to edit cells)", padding="5")
        data_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=(0, 10))
        
        # Treeview for data display
        columns = ['line_num', 'country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end', 
                  'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english', 
                  'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment']
        
        self.tree = ttk.Treeview(data_frame, columns=columns, show='headings', height=15)
        
        # Configure columns
        for col in columns:
            if col == 'line_num':
                self.tree.heading(col, text='#')
                self.tree.column(col, width=40, minwidth=30)
            else:
                self.tree.heading(col, text=col)
                self.tree.column(col, width=100, minwidth=50)
        
        # Scrollbars
        v_scrollbar = ttk.Scrollbar(data_frame, orient=tk.VERTICAL, command=self.tree.yview)
        h_scrollbar = ttk.Scrollbar(data_frame, orient=tk.HORIZONTAL, command=self.tree.xview)
        self.tree.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
        
        # Grid layout
        self.tree.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        v_scrollbar.grid(row=0, column=1, sticky=(tk.N, tk.S))
        h_scrollbar.grid(row=1, column=0, sticky=(tk.W, tk.E))
        
        # Configure grid weights
        data_frame.columnconfigure(0, weight=1)
        data_frame.rowconfigure(0, weight=1)
        
        # Button frame
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=2, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Save button
        save_btn = ttk.Button(button_frame, text="Save to CSV", command=self.save_to_csv)
        save_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Copy button
        copy_btn = ttk.Button(button_frame, text="Copy to Clipboard", command=self.copy_to_clipboard)
        copy_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Status label
        self.status_label = ttk.Label(main_frame, text="Ready")
        self.status_label.grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=(10, 0))
        
        # Bind events
        self.tree.bind('<Double-1>', self.on_double_click)
        self.tree.bind('<Button-1>', self.on_single_click)
        self.tree.bind('<Button-3>', self.on_right_click)
        self.tree.bind('<F2>', self.on_f2_edit)
        
    def select_file(self):
        """Select CSV file to convert"""
        file_path = filedialog.askopenfilename(
            title="Select CSV file",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")]
        )
        
        if file_path:
            self.input_file_path = file_path  # Store the input file path
            self.file_label.config(text=file_path)
            self.status_label.config(text=f"File selected: {file_path}")
            self.load_original_data(file_path)
    
    def load_original_data(self, file_path):
        """Load the original CSV data and detect format"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                self.original_data = list(reader)
            
            # Detect format based on number of columns
            if len(self.original_data) > 0:
                first_row = self.original_data[0]
                if len(first_row) == 19:
                    self.input_format = "kehilot"  # Already in kehilot.csv format
                    self.status_label.config(text=f"Loaded {len(self.original_data)} rows (kehilot.csv format)")
                elif len(first_row) == 9:
                    self.input_format = "input"  # Input format (9 columns)
                    self.status_label.config(text=f"Loaded {len(self.original_data)} rows (input format)")
                else:
                    self.input_format = "unknown"
                    self.status_label.config(text=f"Loaded {len(self.original_data)} rows (unknown format - {len(first_row)} columns)")
            else:
                self.input_format = "empty"
                self.status_label.config(text="File is empty")
                
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load file: {str(e)}")
    
    def convert_data(self):
        """Convert the data to kehilot.csv format"""
        if not self.original_data:
            messagebox.showwarning("Warning", "Please select a file first")
            return
        
        self.progress.start()
        self.status_label.config(text="Converting data...")
        
        # Run conversion synchronously for now
        try:
            converted_rows = []
            
            if self.input_format == "kehilot":
                # Already in kehilot.csv format - just use as is
                data_rows = self.original_data
                for i, row in enumerate(data_rows):
                    if len(row) >= 19:  # Ensure we have enough columns for kehilot format
                        converted_rows.append(row)
            
            elif self.input_format == "input":
                # Input format - convert to kehilot.csv format
                # Check if first row is a header
                data_rows = self.original_data
                if len(data_rows) > 0:
                    first_row = data_rows[0]
                    # Check if first row looks like a header
                    if any(header_word in first_row[0].lower() for header_word in ['country', 'town', 'name']):
                        data_rows = data_rows[1:]  # Skip header
                
                for i, row in enumerate(data_rows):
                    if len(row) < 9:  # Ensure we have enough columns
                        continue
                    
                    # Extract data from input format
                    country = row[0].strip()
                    city = row[1].strip()
                    longitude = row[2].strip()
                    latitude = row[3].strip()
                    year_estab = row[4].strip()
                    year_data = row[5].strip()
                    population = row[6].strip()
                    notes = row[7].strip()
                    source = row[8].strip()
                    
                    # Convert to kehilot.csv format
                    converted_row = self.convert_single_row(
                        country, city, longitude, latitude, year_estab, 
                        year_data, population, notes, source, i, data_rows
                    )
                    
                    if converted_row:
                        converted_rows.append(converted_row)
            
            else:
                # Unknown format - try to handle gracefully
                messagebox.showwarning("Warning", f"Unknown file format with {len(self.original_data[0]) if self.original_data else 0} columns")
                return
            
            self.converted_data = converted_rows
            self.df = pd.DataFrame(converted_rows)
            
            # Update GUI
            self._conversion_complete()
            
        except Exception as e:
            self._conversion_error(str(e))
    
    def convert_single_row(self, country, city, longitude, latitude, year_estab, 
                          year_data, population, notes, source, row_index, all_rows):
        """Convert a single row to kehilot.csv format"""
        try:
            # Basic conversion
            year_start = year_data if year_data and year_data != 'NA' else year_estab
            
            # Find next row for same city to determine year_end and pop_end
            year_end = "2024"  # Default for last row
            pop_end = ""  # Default for last row
            
            # Look for next row with same city
            for j in range(row_index + 1, len(all_rows)):
                if len(all_rows[j]) >= 7 and all_rows[j][1].strip() == city:
                    next_year = all_rows[j][5].strip()
                    next_pop = all_rows[j][6].strip()
                    if next_year and next_year != 'NA':
                        try:
                            year_end = str(int(next_year) - 1)
                        except ValueError:
                            year_end = "2024"
                    if next_pop and next_pop != 'NA':
                        pop_end = next_pop
                    break
            
            # Determine probability based on notes
            probability = "high"
            if notes and ("uncertain" in notes.lower() or "unknown" in notes.lower()):
                probability = "medium"
            elif notes and ("estimated" in notes.lower() or "approx" in notes.lower()):
                probability = "medium"
            
            # Get additional city names (simplified for now)
            city_names = {
                'english': city,
                'hebrew': '',
                'yiddish': '',
                'german': '',
                'other': ''
            }
            
            # Create converted row
            converted_row = [
                country,  # country
                city,     # city
                longitude,  # long
                latitude,   # lat
                year_estab, # year_estab
                year_start, # year_start
                year_end,   # year_end
                population if population != 'NA' else "",  # pop_start
                pop_end,    # pop_end
                probability, # probability
                "1",        # type
                "1",        # symbol
                city_names.get('english', city),  # city_english
                city_names.get('hebrew', ''),     # city_hebrew
                city_names.get('yiddish', ''),    # city_yid
                city_names.get('german', ''),     # city_german
                city_names.get('other', ''),      # city_other
                source,     # source
                notes       # comment
            ]
            
            return converted_row
            
        except Exception as e:
            print(f"Error converting row {row_index}: {str(e)}")
            return None
    
    def _conversion_complete(self):
        """Called when conversion is complete"""
        self.progress.stop()
        self.status_label.config(text=f"Conversion complete: {len(self.converted_data)} rows")
        self.refresh_display()
    
    def _conversion_error(self, error_msg):
        """Called when conversion encounters an error"""
        self.progress.stop()
        messagebox.showerror("Conversion Error", f"Failed to convert data: {error_msg}")
        self.status_label.config(text="Conversion failed")
    
    def refresh_display(self):
        """Refresh the data display"""
        if self.df is not None:
            # Clear existing data
            for item in self.tree.get_children():
                self.tree.delete(item)
            
            # Insert new data with line numbers
            for index, row in self.df.iterrows():
                # Add line number as first column
                values_with_line_num = [index + 1] + list(row)
                self.tree.insert('', 'end', values=values_with_line_num)
    
    def save_to_csv(self):
        """Save the converted data to a new CSV file"""
        if self.converted_data is None:
            messagebox.showwarning("Warning", "No data to save")
            return
        
        # Generate default filename based on input file
        default_filename = ""
        initialdir = "c:"
        if self.input_file_path:
            initialdir, initial_filename = os.path.split(self.input_file_path)
            # Replace .csv with _kehilot.csv
            if initial_filename.lower().endswith('.csv'):
                default_filename = initial_filename.replace('.csv', "_kehilot.csv")
            elif initial_filename.lower().endswith('.txt'):
                default_filename = initial_filename.replace('.txt', "_kehilot.csv")
            else:
                default_filename = self.input_file_path + "_kehilot.csv"
        
        file_path = filedialog.asksaveasfilename(
            title="Save converted data",
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("text files", "*.txt"), ("All files", "*.*")],
            initialdir=initialdir,
            initialfile=default_filename
        )
        
        if file_path:
            try:
                with open(file_path, 'w', newline='', encoding='utf-8') as f:
                    writer = csv.writer(f)
                    # Write header
                    writer.writerow(['country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end', 
                                   'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english', 
                                   'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment'])
                    # Write data
                    writer.writerows(self.converted_data)
                
                self.status_label.config(text=f"Data saved to {file_path}")
                messagebox.showinfo("Success", f"Data saved to {file_path}")
                
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save file: {str(e)}")
    
    def copy_to_clipboard(self):
        """Copy the converted data to clipboard in CSV format"""
        if self.converted_data is None:
            messagebox.showwarning("Warning", "No data to copy")
            return
        
        try:
            # Create CSV string
            csv_string = "country,city,long,lat,year_estab,year_start,year_end,pop_start,pop_end,probability,type,symbol,city_english,city_hebrew,city_yid,city_german,city_other,source,comment\n"
            
            for row in self.converted_data:
                csv_string += ",".join(f'{str(cell)}' for cell in row) + "\n"
            
            # Copy to clipboard
            pyperclip.copy(csv_string)
            self.status_label.config(text="Data copied to clipboard")
            
        except Exception as e:
            messagebox.showerror("Error", f"Failed to copy data: {str(e)}")
    
    def on_double_click(self, event):
        """Handle double-click to start editing"""
        region = self.tree.identify_region(event.x, event.y)
        if region == "cell":
            item = self.tree.identify_row(event.y)
            column = self.tree.identify_column(event.x)
            if item and column:
                self.start_edit(item, column)
    
    def on_single_click(self, event):
        """Handle single click to select item"""
        region = self.tree.identify_region(event.x, event.y)
        if region == "cell":
            item = self.tree.identify_row(event.y)
            if item:
                self.tree.selection_set(item)
    
    def on_right_click(self, event):
        """Handle right-click for context menu"""
        region = self.tree.identify_region(event.x, event.y)
        if region == "cell":
            item = self.tree.identify_row(event.y)
            if item:
                self.tree.selection_set(item)
                self.show_context_menu(event)
    
    def on_f2_edit(self, event):
        """Handle F2 key to start editing"""
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            # Get the first column for editing
            column = '#1'
            self.start_edit(item, column)
    
    def show_context_menu(self, event):
        """Show context menu for editing"""
        context_menu = tk.Menu(self.root, tearoff=0)
        context_menu.add_command(label="Edit Cell", command=self.edit_selected_cell)
        context_menu.add_command(label="Copy Cell", command=self.copy_cell)
        context_menu.add_command(label="Clear Cell", command=self.clear_cell)
        
        try:
            context_menu.tk_popup(event.x_root, event.y_root)
        finally:
            context_menu.grab_release()
    
    def edit_selected_cell(self):
        """Edit the selected cell"""
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            # Get the first column for editing
            column = '#1'
            self.start_edit(item, column)
    
    def copy_cell(self):
        """Copy the selected cell to clipboard"""
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            values = self.tree.item(item, 'values')
            if values:
                pyperclip.copy(str(values[0]))
                self.status_label.config(text="Cell copied to clipboard")
    
    def clear_cell(self):
        """Clear the selected cell"""
        selection = self.tree.selection()
        if selection:
            item = selection[0]
            values = list(self.tree.item(item, 'values'))
            values[0] = ""
            self.tree.item(item, values=values)
            self.status_label.config(text="Cell cleared")
    
    def start_edit(self, item, column):
        """Start editing a cell"""
        # Get the column index
        col_index = int(column.replace('#', '')) - 1
        columns = ['line_num', 'country', 'city', 'long', 'lat', 'year_estab', 'year_start', 'year_end', 
                  'pop_start', 'pop_end', 'probability', 'type', 'symbol', 'city_english', 
                  'city_hebrew', 'city_yid', 'city_german', 'city_other', 'source', 'comment']
        
        if col_index >= len(columns):
            return
        
        col_name = columns[col_index]
        
        # Don't allow editing of line numbers
        if col_name == 'line_num':
            return
        
        # Get current value (adjust for line number column)
        current_value = self.tree.item(item, 'values')[col_index]
        
        # Get cell coordinates
        bbox = self.tree.bbox(item, column)
        if not bbox:
            return
        
        # Create edit window
        self.edit_window = tk.Toplevel(self.root)
        self.edit_window.title(f"Edit {col_name}")
        self.edit_window.geometry("400x200")
        self.edit_window.transient(self.root)
        self.edit_window.grab_set()
        
        # Center the window
        self.edit_window.geometry("+%d+%d" % (self.root.winfo_rootx() + 50, self.root.winfo_rooty() + 50))
        
        # Create text widget
        text_widget = tk.Text(self.edit_window, wrap=tk.WORD, height=8, width=50)
        text_widget.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        text_widget.insert('1.0', current_value)
        text_widget.focus_set()
        text_widget.select_range(0, tk.END)
        
        # Button frame
        button_frame = ttk.Frame(self.edit_window)
        button_frame.pack(fill=tk.X, padx=10, pady=(0, 10))
        
        def save_edit():
            new_value = text_widget.get('1.0', tk.END).strip()
            self.update_cell(item, col_index, new_value)
            self.edit_window.destroy()
        
        def cancel_edit():
            self.edit_window.destroy()
        
        # Buttons
        save_btn = ttk.Button(button_frame, text="Save (Ctrl+Enter)", command=save_edit)
        save_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        cancel_btn = ttk.Button(button_frame, text="Cancel (Escape)", command=cancel_edit)
        cancel_btn.pack(side=tk.LEFT)
        
        # Add some spacing
        ttk.Label(button_frame, text="").pack(side=tk.LEFT, padx=(20, 0))
        
        # Bind keyboard shortcuts
        text_widget.bind('<Control-Return>', lambda e: save_edit())
        text_widget.bind('<Escape>', lambda e: cancel_edit())
        self.edit_window.bind('<Escape>', lambda e: cancel_edit())
        
        # Store editing info
        self.editing_item = item
        self.editing_column = col_index
    
    def update_cell(self, item, col_index, new_value):
        """Update a cell value"""
        if not self.converted_data:
            return
        
        # Get the item index
        item_index = self.tree.index(item)
        
        # Update the data (adjust for line number column)
        if item_index < len(self.converted_data):
            # col_index includes line number column, so subtract 1 for actual data
            data_col_index = col_index - 1
            if data_col_index >= 0 and data_col_index < len(self.converted_data[item_index]):
                self.converted_data[item_index][data_col_index] = new_value
                
                # Update the tree display
                values = list(self.tree.item(item, 'values'))
                values[col_index] = new_value
                self.tree.item(item, values=values)
            
            # Update status
            self.status_label.config(text=f"Updated row {item_index + 1}, column {col_index + 1}")

def main():
    root = tk.Tk()
    app = CSVConverterGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
