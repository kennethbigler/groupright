//
//  FirstViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/18/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "FirstViewController.h"
#import "LoginViewController.h"
#import "GRMainModule.h"
#import "UpdatesTableCell.h"
#import "GRMainModule.h"

@interface FirstViewController ()

@end

@implementation FirstViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}

- (void)viewDidAppear:(BOOL)animated
{
    self.title=@"Updates";
    GRMainModule *grmm = [GRMainModule grMain];
    

    if([grmm ac] == nil )
    {
        UIStoryboard *storyboard = self.storyboard;
        
        LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
        [self presentViewController:lvc animated:NO completion:nil];
    }
    //LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
    //[self presentViewController:lvc animated:NO completion:nil];
    [_UpdatesTable reloadData];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


// =============================================================================================
//  Updates Table
// =============================================================================================

- (NSInteger) numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    GRMainModule *grmm = [GRMainModule grMain];
    return [grmm.updates count];
}

- (UITableViewCell *) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    GRMainModule *grmm = [GRMainModule grMain];
    /*NSString *cellID = @"eventUpdateCell";
    UITableViewCell *newCell;
    
    newCell = [tableView dequeueReusableCellWithIdentifier:cellID];
    if(!newCell)
    {
        newCell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:cellID];
    }
    newCell.textLabel.text=@"hello";
    return newCell;*/
    
    static NSString *cellID = @"UpdateCell";
    
    UpdatesTableCell *cell = (UpdatesTableCell *)[tableView dequeueReusableCellWithIdentifier:cellID];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"UpdatesTableCell" owner:self options:nil];

        cell = (UpdatesTableCell*)[nib objectAtIndex:0];
    }
    
    cell.nameLabel.text = [[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"email"];
    //cell.thumbnailImageView.image = [UIImage imageNamed:];
    cell.infoLabel.text = [[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"description"];
    if([[[grmm.updates objectAtIndex:indexPath.row] objectForKey:@"link_type"] isEqual: @"event"]){
        NSLog(@"event");
    }
    
    return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return [indexPath row] * 20;
}


- (void) tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
}


@end
